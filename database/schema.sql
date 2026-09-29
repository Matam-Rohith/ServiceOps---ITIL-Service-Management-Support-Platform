-- ====================================================================
-- ServiceOps - ITIL Service Management & Support Platform
-- Database: PostgreSQL 16
-- Schema: 3NF Relational Data Definition Language (DDL)
-- ====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    department VARCHAR(100),
    team VARCHAR(100),
    phone VARCHAR(32),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. SLA Policies Table
CREATE TABLE IF NOT EXISTS sla_policies (
    priority VARCHAR(4) PRIMARY KEY, -- P1, P2, P3, P4
    name VARCHAR(100) NOT NULL,
    response_target_minutes INT NOT NULL,
    resolution_target_minutes INT NOT NULL,
    business_hours_only BOOLEAN DEFAULT TRUE NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 3. Configuration Management Database (CMDB) Assets Table
CREATE TABLE IF NOT EXISTS cmdb_assets (
    id VARCHAR(36) PRIMARY KEY,
    asset_tag VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(32) NOT NULL, -- LAPTOP, DESKTOP, SERVER, APPLICATION, NETWORK, PRINTER
    status VARCHAR(32) NOT NULL, -- IN_USE, IN_STORAGE, IN_REPAIR, RETIRED
    owner_name VARCHAR(100),
    department VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    purchase_date VARCHAR(30),
    warranty_expiry VARCHAR(30),
    description TEXT,
    associated_service VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_assets_tag ON cmdb_assets(asset_tag);
CREATE INDEX IF NOT EXISTS idx_assets_type ON cmdb_assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON cmdb_assets(status);

-- 4. Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(36) PRIMARY KEY,
    version BIGINT DEFAULT 0 NOT NULL,
    incident_number VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requester_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_agent_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    assignment_group VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    impact VARCHAR(10) NOT NULL, -- LOW, MEDIUM, HIGH
    urgency VARCHAR(10) NOT NULL, -- LOW, MEDIUM, HIGH
    priority VARCHAR(4) NOT NULL REFERENCES sla_policies(priority),
    status VARCHAR(20) NOT NULL, -- NEW, ASSIGNED, IN_PROGRESS, PENDING, RESOLVED, CLOSED, CANCELLED
    source VARCHAR(20) NOT NULL, -- PORTAL, EMAIL, PHONE, MONITORING
    affected_asset_id VARCHAR(36) REFERENCES cmdb_assets(id) ON DELETE SET NULL,
    affected_service VARCHAR(100),
    related_problem_id VARCHAR(36),
    resolution_notes TEXT,
    pending_reason TEXT,
    sla_policy_name VARCHAR(100),
    response_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    resolution_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    response_breached BOOLEAN DEFAULT FALSE NOT NULL,
    resolution_breached BOOLEAN DEFAULT FALSE NOT NULL,
    sla_status VARCHAR(20) DEFAULT 'ON_TRACK' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    first_response_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_incidents_number ON incidents(incident_number);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_requester ON incidents(requester_id);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned ON incidents(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_incidents_deadlines ON incidents(resolution_deadline, status);

-- 5. Incident Comments Table
CREATE TABLE IF NOT EXISTS incident_comments (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    author_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    content TEXT NOT NULL,
    is_internal_work_note BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_incident ON incident_comments(incident_id);

-- 6. Incident Audit History Table
CREATE TABLE IF NOT EXISTS incident_history (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    actor_name VARCHAR(100) NOT NULL,
    action VARCHAR(150) NOT NULL,
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_history_incident ON incident_history(incident_id);

-- 7. Service Catalog Items Table
CREATE TABLE IF NOT EXISTS service_catalog_items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    approval_required BOOLEAN DEFAULT TRUE NOT NULL,
    default_assignment_group VARCHAR(100) NOT NULL,
    expected_fulfillment_hours INT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    form_fields_json TEXT
);

-- 8. Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
    id VARCHAR(36) PRIMARY KEY,
    request_number VARCHAR(32) NOT NULL UNIQUE,
    catalog_item_id VARCHAR(36) NOT NULL REFERENCES service_catalog_items(id) ON DELETE RESTRICT,
    requester_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_agent_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    assignment_group VARCHAR(100) NOT NULL,
    status VARCHAR(32) NOT NULL, -- PENDING_APPROVAL, APPROVED, IN_PROGRESS, FULFILLED, REJECTED, CANCELLED
    approval_status VARCHAR(20) NOT NULL, -- PENDING, APPROVED, REJECTED, NOT_REQUIRED
    approver_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    approval_decision_at TIMESTAMP WITH TIME ZONE,
    approval_comments TEXT,
    justification TEXT NOT NULL,
    form_data_json TEXT,
    expected_fulfillment_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_requests_number ON service_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON service_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_approval ON service_requests(approval_status);

-- 9. Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id VARCHAR(36) PRIMARY KEY,
    problem_number VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    assigned_team VARCHAR(100) NOT NULL,
    assigned_agent_name VARCHAR(100),
    root_cause TEXT,
    workaround TEXT,
    is_known_error BOOLEAN DEFAULT FALSE NOT NULL,
    status VARCHAR(30) NOT NULL, -- OPEN, UNDER_INVESTIGATION, KNOWN_ERROR, RESOLVED, CLOSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_problems_number ON problems(problem_number);
CREATE INDEX IF NOT EXISTS idx_problems_status ON problems(status);

-- Problem-Incident Join Table (Many-to-Many / One-to-Many)
CREATE TABLE IF NOT EXISTS problem_incidents (
    problem_id VARCHAR(36) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    incident_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (problem_id, incident_id)
);

-- 10. Change Requests (CAB) Table
CREATE TABLE IF NOT EXISTS change_requests (
    id VARCHAR(36) PRIMARY KEY,
    change_number VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,
    change_type VARCHAR(20) NOT NULL, -- STANDARD, NORMAL, EMERGENCY
    risk VARCHAR(10) NOT NULL, -- LOW, MEDIUM, HIGH
    impact VARCHAR(10) NOT NULL, -- LOW, MEDIUM, HIGH
    affected_service VARCHAR(100) NOT NULL,
    implementation_plan TEXT NOT NULL,
    rollback_plan TEXT NOT NULL,
    test_plan TEXT NOT NULL,
    requester_name VARCHAR(100) NOT NULL,
    assigned_owner_name VARCHAR(100) NOT NULL,
    approval_status VARCHAR(20) NOT NULL, -- PENDING, APPROVED, REJECTED
    approver_name VARCHAR(100),
    approval_comments TEXT,
    implementation_status VARCHAR(32) NOT NULL, -- DRAFT, SCHEDULED, IN_PROGRESS, COMPLETED, FAILED, ROLLED_BACK
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_changes_number ON change_requests(change_number);
CREATE INDEX IF NOT EXISTS idx_changes_type ON change_requests(change_type);
CREATE INDEX IF NOT EXISTS idx_changes_status ON change_requests(implementation_status);

-- 11. Knowledge Articles (KCS) Table
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id VARCHAR(36) PRIMARY KEY,
    article_number VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'PUBLISHED' NOT NULL, -- DRAFT, PUBLISHED, ARCHIVED
    view_count INT DEFAULT 0 NOT NULL,
    helpful_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kb_number ON knowledge_articles(article_number);
CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_articles(category);

-- 12. General Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_id VARCHAR(36),
    actor_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
