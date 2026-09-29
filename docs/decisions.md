# ServiceOps - Architecture Decision Records (ADR)

This document explains the technical engineering choices, trade-offs, and design rationale behind ServiceOps.

---

## ADR 01: PostgreSQL Relational Database Selection
- **Status**: Accepted
- **Context**: An enterprise ITSM system involves deeply interrelated entities: Incidents reference Requesters, Agents, CMDB Assets, SLA Policies, and Problems.
- **Decision**: Adopt PostgreSQL 16 with a normalized 3NF relational schema and foreign key constraints.
- **Consequences**:
  - *Positive*: Absolute transactional consistency (ACID); no orphaned records; atomic status transitions; indexed querying for fast SLA scans.
  - *Negative*: Schema migrations require structured DDL migrations compared to schemaless document stores.

---

## ADR 02: Authoritative Backend SLA Processing
- **Status**: Accepted
- **Context**: Naive ticket systems calculate SLA timers exclusively on the frontend, leaving them vulnerable to clock drift or client manipulation.
- **Decision**: All SLA milestones (`response_deadline`, `resolution_deadline`) are generated at ticket inception using authoritative UTC server time. A Spring Boot `@Scheduled` worker evaluates open tickets every 10 seconds.
- **Consequences**:
  - *Positive*: Tamper-proof SLA compliance tracking; accurate audit logs; automatic alerts when tickets reach `AT_RISK` (<25% remaining) or `BREACHED`.
  - *Negative*: Periodic DB query overhead, mitigated by composite indexing on `(resolution_deadline, status)`.

---

## ADR 03: Optimistic Locking for Concurrent Ticket Management
- **Status**: Accepted
- **Context**: In a busy service desk, two agents might simultaneously open and modify the same incident ticket.
- **Decision**: Implement JPA `@Version private Long version;` on the `Incident` entity.
- **Consequences**:
  - *Positive*: Completely prevents lost updates without holding expensive database row-level pessimistic locks.
  - *Negative*: The second committer receives an `OptimisticLockException` (HTTP 409 Conflict) and must refresh their view to inspect the updated state.

---

## ADR 04: Strict DTO Separation from JPA Entities
- **Status**: Accepted
- **Context**: Exposing JPA entities directly in REST controllers causes security vulnerabilities (mass assignment) and serialization failures (Jackson lazy loading loops).
- **Decision**: Enforce strict Request/Response DTO records and an explicit mapping layer.
- **Consequences**:
  - *Positive*: Zero risk of clients overwriting sensitive fields (e.g., setting their own role to ADMIN or forcing status to CLOSED); decoupled API contracts; clean payload shapes.
  - *Negative*: Requires writing and maintaining DTO classes and mapping logic.

---

## ADR 05: Public Customer Replies vs Internal Work Notes
- **Status**: Accepted
- **Context**: ITIL service desk agents need a private space to log technical debug output, network traces, and handoff notes without confusing or alarming the employee.
- **Decision**: The `incident_comments` table includes an `is_internal_work_note` boolean. Employees are filtered from querying internal work notes, and the backend forbids users with the `EMPLOYEE` role from authoring internal notes.
- **Consequences**:
  - *Positive*: Clear separation between customer communications and internal triage; compliant with ITIL best practices.
  - *Negative*: Requires authorization checks inside the comment retrieval and creation logic.
