import React, { useState } from 'react';
import {
  Code2,
  Database,
  Layers,
  ShieldCheck,
  Cpu,
  GitBranch,
  BookOpen,
  CheckCircle2,
  FileCode,
  Terminal,
  Server
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'database' | 'api' | 'interview'>('architecture');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Code2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            System Architecture, Data Models &amp; Interview Defense
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Detailed engineering documentation covering Spring Boot 3 backend design, PostgreSQL schema, ITIL lifecycles, and technical interview questions
        </p>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'architecture'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture &amp; Clean Design</span>
        </button>

        <button
          onClick={() => setActiveSection('database')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'database'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL Schema &amp; ERD</span>
        </button>

        <button
          onClick={() => setActiveSection('api')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'api'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>REST API Catalog</span>
        </button>

        <button
          onClick={() => setActiveSection('interview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeSection === 'interview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Technical Interview Defense Guide</span>
        </button>
      </div>

      {/* Section 1: Architecture & Clean Design */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          {/* Architecture Visual Diagram Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Full-Stack Architecture &amp; Layer Boundary
            </h2>

            {/* Mermaid Architecture Flow Visualization */}
            <div className="p-5 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto space-y-3 leading-relaxed border border-slate-800">
              <div className="text-indigo-400 font-bold">
                ┌────────────────────────────────────────────────────────────────────────┐
              </div>
              <div className="text-indigo-300 font-bold">
                │   React 19 Frontend SPA (Vite + TypeScript + Tailwind CSS + Recharts) │
              </div>
              <div className="text-indigo-400 font-bold">
                └───────────────────────────────────┬────────────────────────────────────┘
              </div>
              <div className="text-slate-400 pl-40">
                │ HTTPS JSON REST + JWT Bearer Authorization Header
              </div>
              <div className="text-slate-400 pl-40">
                ▼
              </div>
              <div className="text-sky-400 font-bold">
                ┌────────────────────────────────────────────────────────────────────────┐
              </div>
              <div className="text-sky-300 font-bold">
                │   Spring Boot 3.3.x Application Layer (Java 21 + Embedded Tomcat)     │
              </div>
              <div className="text-sky-400 font-bold">
                │                                                                        │
              </div>
              <div className="text-slate-300 pl-4">
                ├─► <span className="text-amber-400 font-bold">Security Filter Chain</span> (JwtAuthFilter &bull; BCryptPasswordEncoder &bull; RBAC)
              </div>
              <div className="text-slate-300 pl-4">
                ├─► <span className="text-emerald-400 font-bold">Controller Layer</span> (REST Endpoints &bull; @Valid Request DTOs &bull; ResponseEntities)
              </div>
              <div className="text-slate-300 pl-4">
                ├─► <span className="text-blue-400 font-bold">Service Layer</span> (Explicit Business Rules &bull; ITIL State Machines &bull; @Transactional)
              </div>
              <div className="text-slate-300 pl-4">
                ├─► <span className="text-purple-400 font-bold">Authoritative SLA Engine</span> (@Scheduled Cron &bull; Breach Detection &bull; Target Recalc)
              </div>
              <div className="text-slate-300 pl-4">
                ├─► <span className="text-rose-400 font-bold">Audit Event Logger</span> (Immutable History &bull; Actor Attribution &bull; Diff Recording)
              </div>
              <div className="text-slate-300 pl-4">
                └─► <span className="text-teal-400 font-bold">Repository Layer</span> (Spring Data JPA &bull; Hibernate 6 &bull; HikariCP Connection Pool)
              </div>
              <div className="text-sky-400 font-bold">
                └───────────────────────────────────┬────────────────────────────────────┘
              </div>
              <div className="text-slate-400 pl-40">
                │ SQL Queries via JPA / ACID Transactions
              </div>
              <div className="text-slate-400 pl-40">
                ▼
              </div>
              <div className="text-emerald-400 font-bold">
                ┌────────────────────────────────────────────────────────────────────────┐
              </div>
              <div className="text-emerald-300 font-bold">
                │   PostgreSQL 16 Relational Database (Normalized Schema &amp; Foreign Keys)  │
              </div>
              <div className="text-emerald-400 font-bold">
                └────────────────────────────────────────────────────────────────────────┘
              </div>
            </div>
          </div>

          {/* Package Structure Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Backend Package Structure &amp; Clean Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-mono font-bold text-indigo-700 block">com.serviceops.controller</span>
                <p className="text-slate-600 leading-relaxed">
                  Pure HTTP presentation layer. Handles deserialization, invokes Bean Validation (<code className="bg-white px-1 border rounded">@Valid</code>), and returns HTTP status codes. Contains <strong>zero business logic</strong>.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-mono font-bold text-indigo-700 block">com.serviceops.service</span>
                <p className="text-slate-600 leading-relaxed">
                  Defines domain business workflows, state transitions (Incident Lifecycle, Approval Chains), transactional boundaries (<code className="bg-white px-1 border rounded">@Transactional</code>), and SLA calculations.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-mono font-bold text-indigo-700 block">com.serviceops.dto &amp; mapper</span>
                <p className="text-slate-600 leading-relaxed">
                  Strict Data Transfer Objects (Request/Response). Entities are <strong>never directly exposed</strong> to prevent unintended database mutations, mass-assignment vulnerabilities, and circular serialization loops.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-mono font-bold text-indigo-700 block">com.serviceops.security</span>
                <p className="text-slate-600 leading-relaxed">
                  Spring Security 6 stateless filter chain. Extracts and verifies HMAC-SHA256 JWT tokens, validates claims, and populates <code className="bg-white px-1 border rounded">SecurityContextHolder</code> with granted authorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Database Schema & ERD */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              PostgreSQL Relational Schema Overview
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed according to 3NF standards with strict foreign keys, cascade safety, indexed lookups on critical query paths, and immutable audit logging.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-indigo-700 block text-xs">users</span>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li><strong className="text-slate-900">id</strong> VARCHAR(36) PK</li>
                  <li>email VARCHAR(255) UNIQUE</li>
                  <li>password_hash VARCHAR(255)</li>
                  <li>role VARCHAR(32)</li>
                  <li>department VARCHAR(100)</li>
                  <li>created_at TIMESTAMP</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-indigo-700 block text-xs">incidents</span>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li><strong className="text-slate-900">id</strong> VARCHAR(36) PK</li>
                  <li>incident_number VARCHAR(32) UNIQUE</li>
                  <li>requester_id VARCHAR(36) FK</li>
                  <li>assigned_agent_id VARCHAR(36) FK</li>
                  <li>priority VARCHAR(4) (P1-P4)</li>
                  <li>status VARCHAR(32)</li>
                  <li>affected_asset_id VARCHAR(36) FK</li>
                  <li>sla_deadline TIMESTAMP</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-indigo-700 block text-xs">sla_policies</span>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li><strong className="text-slate-900">priority</strong> VARCHAR(4) PK</li>
                  <li>name VARCHAR(100)</li>
                  <li>response_target_min INT</li>
                  <li>resolution_target_min INT</li>
                  <li>business_hours_only BOOLEAN</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-indigo-700 block text-xs">service_requests</span>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li><strong className="text-slate-900">id</strong> VARCHAR(36) PK</li>
                  <li>request_number VARCHAR(32) UNIQUE</li>
                  <li>catalog_item_id VARCHAR(36) FK</li>
                  <li>requester_id VARCHAR(36) FK</li>
                  <li>approval_status VARCHAR(32)</li>
                  <li>status VARCHAR(32)</li>
                  <li>expected_fulfillment TIMESTAMP</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-indigo-700 block text-xs">problems</span>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li><strong className="text-slate-900">id</strong> VARCHAR(36) PK</li>
                  <li>problem_number VARCHAR(32) UNIQUE</li>
                  <li>root_cause TEXT</li>
                  <li>workaround TEXT</li>
                  <li>is_known_error BOOLEAN</li>
                  <li>status VARCHAR(32)</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-indigo-700 block text-xs">cmdb_assets</span>
                <ul className="text-slate-600 space-y-1 text-[11px]">
                  <li><strong className="text-slate-900">id</strong> VARCHAR(36) PK</li>
                  <li>asset_tag VARCHAR(32) UNIQUE</li>
                  <li>type VARCHAR(32)</li>
                  <li>status VARCHAR(32)</li>
                  <li>owner_id VARCHAR(36) FK</li>
                  <li>serial_number VARCHAR(100)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: REST API Catalog */}
      {activeSection === 'api' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
              <h2 className="text-sm font-bold text-slate-900">
                RESTful API Endpoint Catalog (OpenAPI 3.0 Compatible)
              </h2>
            </div>
            <div className="divide-y divide-slate-100 text-xs font-mono">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">POST</span>
                  <span className="font-bold text-slate-900">/api/auth/login</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Public &bull; Authenticate user &amp; generate JWT</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                  <span className="font-bold text-slate-900">/api/incidents</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Authenticated &bull; Paginated incident search &amp; filter</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">POST</span>
                  <span className="font-bold text-slate-900">/api/incidents</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Authenticated &bull; Create incident with dynamic SLA</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">PATCH</span>
                  <span className="font-bold text-slate-900">/api/incidents/{'{id}'}/status</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Staff Only &bull; Transition ticket state machine</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">PATCH</span>
                  <span className="font-bold text-slate-900">/api/incidents/{'{id}'}/assign</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Staff Only &bull; Assign to agent or team</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">POST</span>
                  <span className="font-bold text-slate-900">/api/service-requests/{'{id}'}/approve</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Manager/Admin &bull; Approve or reject request</span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                  <span className="font-bold text-slate-900">/api/dashboard/metrics</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">Staff Only &bull; Operational MTTR, MTTA, and SLA analytics</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Technical Interview Defense Guide */}
      {activeSection === 'interview' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Technical Interview Defense Guide (Core Engineering Decisions)
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  1. Why was PostgreSQL chosen instead of a NoSQL document database?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  ITSM platforms are inherently relational: an incident links to a requester (user), an assigned agent, a configuration item (asset in CMDB), an SLA policy, comments, history entries, and potentially a problem record. ACID guarantees are critical to ensure ticket numbers remain strictly unique under concurrency, and that status transitions, SLA milestone timestamps, and audit events commit atomically within a single database transaction boundary.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  2. How does the SLA tracking engine avoid client-side clock tampering?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  SLA deadlines (<code className="bg-white px-1 border rounded">response_deadline</code>, <code className="bg-white px-1 border rounded">resolution_deadline</code>) are calculated strictly on the backend using authoritative UTC server time at ticket creation. A scheduled background worker (<code className="bg-white px-1 border rounded">@Scheduled</code>) evaluates open tickets, marks breaches, and flags <code className="bg-white px-1 border rounded">AT_RISK</code> status when remaining time drops below 25%. The frontend merely renders the countdown relative to server timestamps.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  3. How does the Priority Matrix work and why is it deterministic?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Following ITIL standards, priority is a function of <strong>Impact</strong> (number of users/services affected) multiplied by <strong>Urgency</strong> (business time criticality). For example, HIGH impact + HIGH urgency always yields P1 (Critical), while LOW + LOW yields P4. Decoupling Priority from user subjectivity prevents ticket submitters from artificially setting every issue to "Critical" without demonstrating high enterprise impact.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  4. What prevents two agents from overwriting each other's changes concurrently?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  In JPA/Hibernate, Optimistic Locking is implemented using a <code className="bg-white px-1 border rounded">@Version private Long version;</code> field on the <code className="bg-white px-1 border rounded">Incident</code> entity. If Agent A and Agent B load the ticket simultaneously, and Agent A commits first, Agent B's commit fails with an <code className="bg-white px-1 border rounded">OptimisticLockException</code>, preventing silent data loss and prompting Agent B to refresh and review the updated state.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  5. Why are DTOs utilized rather than exposing JPA Entities in API controllers?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Exposing entities directly causes security vulnerabilities (over-posting / mass assignment where malicious clients pass fields like <code className="bg-white px-1 border rounded">role = ADMIN</code> or <code className="bg-white px-1 border rounded">status = CLOSED</code>), tightly couples the database schema to the public API contract, and frequently triggers Jackson <code className="bg-white px-1 border rounded">LazyInitializationException</code> or infinite circular recursion when bidirectional relationships are serialized.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
