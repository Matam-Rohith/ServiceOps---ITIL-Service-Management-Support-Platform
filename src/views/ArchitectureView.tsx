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
            System Architecture &amp; Technical Specifications
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Engineering documentation covering backend service boundaries, PostgreSQL data schema, ITIL workflows, and Architecture Decision Records (ADRs)
        </p>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'interview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Architecture Decision Records (ADRs)</span>
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

      {/* Section 4: Architecture Decision Records (ADRs) */}
      {activeSection === 'interview' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Architecture Decision Records (ADRs)
              </h2>
              <span className="text-xs text-slate-400 font-mono">Status: Accepted &bull; ITIL v4 Compliant</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">
                    ADR-001: Relational ACID Persistence for Lifecycles &amp; Audit Logs
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Context:</strong> ITSM platforms are inherently relational: an incident connects to a requester, an assigned agent, a configuration item (asset in CMDB), an SLA policy, comments, history entries, and linked problem records.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Decision:</strong> Use PostgreSQL with full ACID transaction boundaries. Ticket sequences remain strictly atomic under high ticket load, and milestone timestamps (first response, resolution, SLA breach flags) commit synchronously within a single transaction boundary.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">
                    ADR-002: Deterministic Priority Matrix &amp; Server-Authoritative SLA Engine
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Context:</strong> Allowing ticket requesters to self-assign severity leads to ticket inflation (everything submitted as Critical). Furthermore, client clock discrepancies or tampering could distort SLA compliance.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Decision:</strong> Priority is calculated strictly through the ITIL matrix: <code className="bg-white px-1 border rounded">Priority = f(Impact, Urgency)</code>. Deadlines (<code className="bg-white px-1 border rounded">responseDeadline</code>, <code className="bg-white px-1 border rounded">resolutionDeadline</code>) are locked using authoritative UTC server time upon intake. Periodic background evaluation marks breaches independently of client interaction.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">
                    ADR-003: Concurrency Control via Entity Optimistic Locking
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Context:</strong> Multiple service agents or dispatchers frequently inspect and update shared ticket queues simultaneously.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Decision:</strong> Entities enforce Optimistic Locking using a version field (<code className="bg-white px-1 border rounded">@Version Long version</code>). If two agents modify a ticket concurrently, the later write receives an <code className="bg-white px-1 border rounded">OptimisticLockException</code>, preventing silent overwrites and prompting the agent to refresh the current record state.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">
                    ADR-004: Anti-Mass-Assignment DTO Boundaries
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Context:</strong> Direct binding of request payloads to persistent entities exposes security vulnerabilities (over-posting / mass assignment of protected fields such as <code className="bg-white px-1 border rounded">role</code>, <code className="bg-white px-1 border rounded">status</code>, or SLA fields).
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Decision:</strong> Distinct Request and Response DTOs enforce strict input validation (<code className="bg-white px-1 border rounded">@Valid</code>, <code className="bg-white px-1 border rounded">@NotNull</code>). Entities never cross the presentation layer directly, eliminating over-posting risks and preventing serialization circular loops.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
