# ServiceOps - ITIL v4 Workflow Lifecycles

## 1. Incident Management Lifecycle

```
[NEW] (Reported via Portal / Monitoring / Phone)
  │
  ├───► Assigned to Specialist ───► [ASSIGNED]
  │                                     │
  │                                     ├───► Start Work ───► [IN_PROGRESS]
  │                                                               │     ▲
  │                                        Wait for User/Vendor   │     │ Information Received
  │                                                               ▼     │
  │                                                           [PENDING (SLA Paused)]
  │                                                               │
  │                                                               ▼
  │                                                       Resolution Applied
  │                                                               │
  │                                                               ▼
  │                                                          [RESOLVED]
  │                                                               │
  │                                                       Caller Confirms / Auto-close (72h)
  │                                                               │
  │                                                               ▼
  │                                                           [CLOSED]
```

### Deterministic Priority Matrix Logic
```
Impact \ Urgency    HIGH      MEDIUM     LOW
HIGH                 P1        P2        P3
MEDIUM               P2        P3        P4
LOW                  P3        P4        P4
```
- **P1 - Critical**: 15m First Response Target &bull; 4h Resolution Target (24x7 Continuous)
- **P2 - High**: 30m First Response Target &bull; 8h Resolution Target (Business Hours)
- **P3 - Moderate**: 2h First Response Target &bull; 24h Resolution Target (Business Hours)
- **P4 - Low**: 4h First Response Target &bull; 72h Resolution Target (Business Hours)

---

## 2. Service Request & Approval Workflow
1. **Catalog Browsing**: Employee selects item from categorized Service Catalog (Hardware, Access, Software).
2. **Dynamic Form Submission**: Input validation runs for item-specific parameters (e.g. laptop specs, cloud duration).
3. **Approval Routing**:
   - If `approval_required == false`: Automatically approved and routed to fulfillment queue.
   - If `approval_required == true`: Routed to Manager's Approvals Queue (`PENDING_APPROVAL`).
4. **Manager Decision**: Approver accepts with budget code or rejects with rationale.
5. **Fulfillment**: Service desk provisions resource, sets state to `IN_PROGRESS`, and transitions to `FULFILLED`.

---

## 3. Problem Management (Root Cause & KEDB)
1. **Detection**: Recurring incidents (e.g. VPN timeouts) are linked to a single Problem record.
2. **Investigation**: Engineering isolates the technical fault (e.g. MTU carrier clamp mismatch).
3. **Workaround Documentation**: Immediate tactical fix is published to agents and self-service callers.
4. **Known Error Database (KEDB)**: Problem is flagged as Known Error if permanent fix is awaiting vendor patch.
5. **Resolution**: Permanent architectural fix deployed via Change Management, resolving linked incidents.

---

## 4. Change Enablement & CAB Review
- **Standard Changes**: Pre-approved, low-risk, repeatable procedures (e.g. routine OS kernel security updates).
- **Normal Changes**: Require Change Advisory Board (CAB) review, risk assessment, formal rollback plan, and off-peak scheduling window.
- **Emergency Changes**: Expedited review by Emergency CAB (ECAB) to resolve active P1 critical outages.
