# ServiceOps - REST API Specification

All API endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <JWT>` header.

## Authentication
### `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "agent@serviceops.local",
  "password": "Demo123!"
}
```
- **Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresInMs": 86400000,
  "user": {
    "id": "usr-2",
    "name": "Marcus Vance",
    "email": "agent@serviceops.local",
    "role": "SERVICE_AGENT",
    "department": "IT Support & Operations",
    "team": "Desktop Support L2"
  }
}
```

---

## Incidents
### `POST /api/incidents`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "title": "VPN gateway handshake drops intermittently",
  "description": "Remote staff connecting through US-West experience packet loss every 10 minutes.",
  "category": "NETWORK",
  "subcategory": "VPN / Remote Access",
  "impact": "HIGH",
  "urgency": "HIGH",
  "source": "PORTAL",
  "affectedAssetId": "ast-2",
  "affectedService": "Enterprise VPN Access"
}
```
- **Response**: `201 Created` with computed `priority: "P1"` and SLA deadlines.

### `GET /api/incidents`
- **Access**: Authenticated
- **Query Parameters**:
  - `status` (optional): `NEW`, `ASSIGNED`, `IN_PROGRESS`, `PENDING`, `RESOLVED`, `CLOSED`
  - `requesterId` (optional): Filter to tickets submitted by a specific user.

### `PATCH /api/incidents/{id}/status`
- **Access**: Staff (`SERVICE_AGENT`, `SERVICE_MANAGER`, `ADMIN`)
- **Request Body**:
```json
{
  "status": "RESOLVED",
  "notes": "Upgraded router interface firmware and clamped MTU to 1380 bytes."
}
```

### `POST /api/incidents/{id}/comments`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "content": "Packet capture shows fragmentation along carrier path.",
  "isInternalWorkNote": true
}
```

---

## Service Requests & Approvals
### `POST /api/service-requests`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "catalogItemId": "cat-1",
  "justification": "Required for compiling iOS/macOS prototypes locally.",
  "formData": {
    "platform": "MacBook Pro 16\" (M3 Max, 64GB RAM)",
    "shippingAddress": "Desk 312, Building A"
  }
}
```

### `POST /api/service-requests/{id}/approve`
- **Access**: `SERVICE_MANAGER`, `ADMIN`
- **Request Body**:
```json
{
  "approved": true,
  "comments": "Approved against Q4 hardware capital allocation."
}
```

---

## Operational Metrics
### `GET /api/dashboard/metrics`
- **Access**: Staff
- **Response**: `200 OK`
```json
{
  "openIncidents": 4,
  "criticalIncidents": 1,
  "breachedSlaCount": 0,
  "slaCompliancePercentage": 100,
  "avgResolutionHours": 3.8,
  "avgFirstResponseMinutes": 14,
  "openRequests": 2,
  "pendingApprovals": 1,
  "activeProblems": 2,
  "scheduledChanges": 1
}
```
