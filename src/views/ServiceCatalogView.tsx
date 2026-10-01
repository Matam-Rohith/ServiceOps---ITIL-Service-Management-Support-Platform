import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { Modal } from '../components/common/Modal';
import { ServiceCatalogItem } from '../types';
import {
  Laptop,
  Code,
  ShieldCheck,
  Cloud,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface ServiceCatalogViewProps {
  onSuccessSubmit: (requestId: string) => void;
  selectedItemId?: string;
}

export const ServiceCatalogView: React.FC<ServiceCatalogViewProps> = ({
  onSuccessSubmit,
  selectedItemId
}) => {
  const { catalogItems, createServiceRequest, currentUser } = useServiceOps();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<ServiceCatalogItem | null>(() => {
    if (selectedItemId) {
      return catalogItems.find(c => c.id === selectedItemId) || null;
    }
    return null;
  });

  React.useEffect(() => {
    if (selectedItemId) {
      const match = catalogItems.find(c => c.id === selectedItemId);
      if (match) setSelectedItem(match);
    }
  }, [selectedItemId, catalogItems]);

  const [justification, setJustification] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Services' },
    { id: 'HARDWARE', label: 'Hardware & Workstations' },
    { id: 'SOFTWARE', label: 'Developer Software & Licenses' },
    { id: 'ACCESS', label: 'Access & Security Privileges' },
    { id: 'CLOUD', label: 'Cloud Infrastructure' },
    { id: 'ONBOARDING', label: 'Employee Onboarding' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return Laptop;
      case 'Code': return Code;
      case 'ShieldCheck': return ShieldCheck;
      case 'Cloud': return Cloud;
      case 'UserPlus': return UserPlus;
      default: return ShoppingBag;
    }
  };

  const filteredItems = catalogItems.filter(item => {
    if (!item.active) return false;
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    return true;
  });

  const handleOpenItem = (item: ServiceCatalogItem) => {
    setSelectedItem(item);
    setJustification('');
    setFormData({});
    setFormError('');
  };

  const handleFormChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (!justification.trim()) {
      setFormError('Business justification is required for IT catalog requests.');
      return;
    }

    // Verify required form fields
    for (const field of selectedItem.formFields) {
      if (field.required && !formData[field.name]) {
        setFormError(`Please complete required field: ${field.label}`);
        return;
      }
    }

    const newReq = createServiceRequest(selectedItem.id, justification.trim(), formData);
    setSelectedItem(null);
    onSuccessSubmit(newReq.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          IT Service Catalog
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Request hardware provisioning, developer licenses, cloud sandboxes, and elevated security access
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === c.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          const Icon = getIcon(item.icon);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  {item.approvalRequired ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Manager Approval
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Standard / Auto
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.expectedFulfillmentHours}h SLA</span>
                </div>
                <button
                  onClick={() => handleOpenItem(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition-colors"
                >
                  <span>Request Item</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Request Submission Modal */}
      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={`Order: ${selectedItem.name}`}
          subtitle={`Fulfillment Group: ${selectedItem.defaultAssignmentGroup} &bull; Expected Delivery: ${selectedItem.expectedFulfillmentHours} hours`}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            {/* Approval Notice */}
            {selectedItem.approvalRequired && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">Manager Approval Required</span>
                  <span className="text-amber-800">
                    This request will route to your reporting manager (Sai) for authorization before fulfillment.
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Form Fields */}
            {selectedItem.formFields.map(field => (
              <div key={field.name}>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>

                {field.type === 'select' && (
                  <select
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                    placeholder="Enter details..."
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={2}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                    placeholder="Enter details..."
                  />
                )}

                {field.type === 'checkbox' && (
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={formData[field.name] === 'true'}
                      onChange={(e) => handleFormChange(field.name, e.target.checked ? 'true' : 'false')}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-700">Include standard accessories pack</span>
                  </label>
                )}
              </div>
            ))}

            {/* Business Justification */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Justification &amp; Cost Center *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain the project requirement, current limitation, or business necessity..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
              >
                Submit Service Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
