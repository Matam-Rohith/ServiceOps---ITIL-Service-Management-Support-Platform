import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { Modal } from '../components/common/Modal';
import { KnowledgeArticle } from '../types';
import {
  BookOpen,
  Search,
  ThumbsUp,
  Eye,
  PlusCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { articles, createArticle, incrementArticleView, voteHelpful, currentUser } = useServiceOps();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [readingArticle, setReadingArticle] = useState<KnowledgeArticle | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Article Form
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General Support');

  const categories = [
    { id: 'ALL', label: 'All Knowledge' },
    { id: 'Network & Connectivity', label: 'Network & VPN' },
    { id: 'Hardware & Peripherals', label: 'Hardware & Peripherals' },
    { id: 'Identity & Security', label: 'Identity & Security' },
    { id: 'General Support', label: 'General Guides' }
  ];

  const filteredArticles = articles.filter(a => {
    if (a.status !== 'PUBLISHED' && currentUser.role === 'EMPLOYEE') return false;
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) ||
             a.summary.toLowerCase().includes(q) ||
             a.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenArticle = (a: KnowledgeArticle) => {
    incrementArticleView(a.id);
    setReadingArticle(a);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createArticle({
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      category,
      status: 'PUBLISHED'
    });

    setCreateModalOpen(false);
    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            IT ServiceOps Knowledge Base
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified technical troubleshooting runbooks, self-service solutions, and IT SOPs
          </p>
        </div>

        {currentUser.role !== 'EMPLOYEE' && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Author Knowledge Article</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified IT runbooks, VPN fixes, Wi-Fi configuration, error codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map(a => (
          <div
            key={a.id}
            onClick={() => handleOpenArticle(a)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {a.articleNumber}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {a.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{a.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {a.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {a.viewCount}
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <ThumbsUp className="w-3.5 h-3.5" /> {a.helpfulCount}
                </span>
              </div>
              <span className="font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                Read Guide &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {readingArticle && (
        <Modal
          isOpen={true}
          onClose={() => setReadingArticle(null)}
          title={readingArticle.title}
          subtitle={`Article ID: ${readingArticle.articleNumber} &bull; Author: ${readingArticle.authorName} &bull; Category: ${readingArticle.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 italic">
              {readingArticle.summary}
            </div>

            <div className="prose prose-sm max-w-none text-xs leading-relaxed whitespace-pre-line font-sans bg-white p-2">
              {readingArticle.content}
            </div>

            {/* Helpful Feedback Widget */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-xs">
                Was this guide helpful in solving your problem?
              </span>
              <button
                onClick={() => {
                  voteHelpful(readingArticle.id);
                  setReadingArticle(prev => prev ? { ...prev, helpfulCount: prev.helpfulCount + 1 } : null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Yes ({readingArticle.helpfulCount})</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Article Modal */}
      {createModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCreateModalOpen(false)}
          title="Author New Knowledge Article (KCS)"
          subtitle="Publish verified technical troubleshooting steps to the ServiceOps repository"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fixing Palo Alto GlobalProtect SSL Handshake Failures on Windows 11"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Network & Connectivity">Network &amp; Connectivity</option>
                  <option value="Hardware & Peripherals">Hardware &amp; Peripherals</option>
                  <option value="Identity & Security">Identity &amp; Security</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Summary *</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One sentence synopsis of what problem this article solves..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Article Body Content (Markdown supported) *
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="### Symptoms&#10;Describe what the caller experiences...&#10;&#10;### Resolution Steps&#10;1. Step one...&#10;2. Step two..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Publish Knowledge Article
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
