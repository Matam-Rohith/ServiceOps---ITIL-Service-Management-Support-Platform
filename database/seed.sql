-- ====================================================================
-- ServiceOps - Seed Data Script
-- Passwords: All demo accounts use 'Demo123!'
-- BCrypt: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi
-- ====================================================================

-- 1. Users
INSERT INTO users (id, name, email, password_hash, role, department, team, phone, avatar_url, created_at)
VALUES
('usr-1', 'Sarah Chen', 'employee@serviceops.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'EMPLOYEE', 'Product & Design', 'UI/UX Team', '+1 (555) 234-5678', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', NOW()),
('usr-2', 'Marcus Vance', 'agent@serviceops.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'SERVICE_AGENT', 'IT Support & Operations', 'Desktop Support L2', '+1 (555) 876-5432', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', NOW()),
('usr-3', 'Elena Rostova', 'manager@serviceops.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'SERVICE_MANAGER', 'IT Service Management', 'Service Desk Leadership', '+1 (555) 345-6789', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', NOW()),
('usr-4', 'David Kim', 'admin@serviceops.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ADMIN', 'Enterprise Systems & Security', 'Infrastructure & SecOps', '+1 (555) 456-7890', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', NOW()),
('usr-5', 'Aiden Patel', 'aiden.patel@serviceops.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'SERVICE_AGENT', 'IT Support & Operations', 'Service Desk L1', '+1 (555) 567-8901', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. SLA Policies
INSERT INTO sla_policies (priority, name, response_target_minutes, resolution_target_minutes, business_hours_only, active)
VALUES
('P1', 'P1 - Critical Priority SLA', 15, 240, FALSE, TRUE),
('P2', 'P2 - High Priority SLA', 30, 480, TRUE, TRUE),
('P3', 'P3 - Moderate Priority SLA', 120, 1440, TRUE, TRUE),
('P4', 'P4 - Low Priority SLA', 240, 4320, TRUE, TRUE)
ON CONFLICT (priority) DO NOTHING;

-- 3. CMDB Assets
INSERT INTO cmdb_assets (id, asset_tag, name, type, status, owner_name, department, location, serial_number, purchase_date, warranty_expiry, description, associated_service)
VALUES
('ast-1', 'AST-4001', 'MacBook Pro 16" M3 Max (64GB/1TB)', 'LAPTOP', 'IN_USE', 'Sarah Chen', 'Product & Design', 'Building A, Floor 3 (Desk 312)', 'C02G994XMD6R', '2024-01-15', '2027-01-15', 'Apple Silicon M3 Max workstation configured for UI/UX rendering.', 'Digital Workplace'),
('ast-2', 'AST-4002', 'Primary VPN Gateway Cluster (Palo Alto PA-5250)', 'NETWORK', 'IN_USE', NULL, 'Infrastructure & SecOps', 'Data Center US-East (Rack 14-B)', 'PA5250-9938102', '2023-04-10', '2028-04-10', 'GlobalProtect IPsec/SSL VPN gateway cluster handling remote staff tunneling.', 'Enterprise VPN Access'),
('ast-3', 'AST-4003', 'Production Core PostgreSQL Cluster (Multi-AZ)', 'SERVER', 'IN_USE', NULL, 'Cloud Platform Ops', 'AWS us-east-1 (VPC-Prod-Core)', 'RDS-PG15-PROD-01', '2023-08-01', '2026-08-01', 'High-availability primary transactional relational cluster with streaming replica.', 'Core Banking & ERP Services'),
('ast-4', 'AST-4004', 'Okta Identity Cloud & Directory Bridge', 'APPLICATION', 'IN_USE', NULL, 'Enterprise Systems & Security', 'Cloud SaaS', 'OKTA-TENANT-SRVOPS', '2022-11-20', '2026-11-20', 'Centralized Single Sign-On (SSO) and adaptive MFA authentication provider.', 'Identity & Access Management'),
('ast-5', 'AST-4005', 'HP Color LaserJet Enterprise Flow M682z', 'PRINTER', 'IN_REPAIR', NULL, 'Office Facilities', 'Building B, Floor 2 Print Room', 'HP-MFP-881293', '2022-03-12', '2025-03-12', 'Networked departmental multi-function printer.', 'Printing & Scanning')
ON CONFLICT (id) DO NOTHING;

-- 4. Incidents
INSERT INTO incidents (
    id, version, incident_number, title, description, requester_id, assigned_agent_id, assignment_group,
    category, subcategory, impact, urgency, priority, status, source, affected_asset_id, affected_service,
    related_problem_id, resolution_notes, pending_reason, sla_policy_name, response_deadline, resolution_deadline,
    response_breached, resolution_breached, sla_status, created_at, updated_at, first_response_at, resolved_at
)
VALUES
(
    'inc-1', 0, 'INC-1001', 'Intermittent GlobalProtect VPN gateway timeouts for West Coast staff',
    'Remote staff connecting through the US-West VPN profile report handshake drops every 10-15 minutes.',
    'usr-1', 'usr-2', 'Infrastructure & Network L3', 'NETWORK', 'VPN / Remote Access',
    'HIGH', 'HIGH', 'P1', 'IN_PROGRESS', 'PORTAL', 'ast-2', 'Enterprise VPN Access',
    'prb-1', NULL, NULL, 'P1 - Critical Priority SLA',
    NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '3 hours',
    FALSE, FALSE, 'ON_TRACK',
    NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '40 minutes', NULL
),
(
    'inc-2', 0, 'INC-1002', 'Developer workstation recurring kernel panics on macOS Sequoia update',
    'MacBook Pro restarts spontaneously when connecting to DisplayLink USB-C multi-monitor dock.',
    'usr-1', 'usr-2', 'Desktop Support L2', 'HARDWARE', 'Workstation / Laptop',
    'MEDIUM', 'HIGH', 'P2', 'ASSIGNED', 'PORTAL', 'ast-1', 'Digital Workplace',
    'prb-2', NULL, NULL, 'P2 - High Priority SLA',
    NOW() - INTERVAL '60 minutes', NOW() + INTERVAL '6 hours',
    FALSE, FALSE, 'ON_TRACK',
    NOW() - INTERVAL '90 minutes', NOW() - INTERVAL '75 minutes', NOW() - INTERVAL '75 minutes', NULL
),
(
    'inc-4', 0, 'INC-1004', 'PostgreSQL read-replica connection pool exhaustion during reporting',
    'Automated reporting batch queries held idle-in-transaction connections, bringing pool saturation to 100%.',
    'usr-4', 'usr-4', 'Cloud Platform Ops', 'DATABASE', 'Connection Pool',
    'HIGH', 'HIGH', 'P1', 'RESOLVED', 'MONITORING', 'ast-3', 'Core Banking & ERP Services',
    NULL, 'Terminated leaked idle connections via pg_terminate_backend. Scaled PgBouncer pool ceiling to 150.', NULL,
    'P1 - Critical Priority SLA',
    NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hour',
    FALSE, FALSE, 'ON_TRACK',
    NOW() - INTERVAL '5 hours', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '290 minutes', NOW() - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Service Catalog Items
INSERT INTO service_catalog_items (id, name, description, category, icon, approval_required, default_assignment_group, expected_fulfillment_hours, active, form_fields_json)
VALUES
('cat-1', 'High-Performance Developer Workstation', 'Order a 16-inch Apple Silicon M3/M4 or Dell XPS Precision laptop with dual 4K monitors and docking station.', 'HARDWARE', 'Laptop', TRUE, 'Desktop Support L2', 48, TRUE, '[]'),
('cat-2', 'Production VPN & Bastion Gateway Access', 'Request elevated cryptographic tunneling and SSH/Kubernetes bastion access into production VPCs.', 'ACCESS', 'ShieldCheck', TRUE, 'CyberSecurity Operations', 24, TRUE, '[]'),
('cat-3', 'JetBrains All Products Pack License', 'Enterprise yearly subscription for IntelliJ IDEA Ultimate, WebStorm, PyCharm, and GoLand.', 'SOFTWARE', 'Code', FALSE, 'Desktop Support L2', 4, TRUE, '[]'),
('cat-4', 'Dedicated AWS Sandbox Cloud Account', 'Provision an isolated AWS account in the corporate AWS Organizations structure with budget alerts ($500/mo cap).', 'CLOUD', 'Cloud', TRUE, 'Cloud Platform Ops', 24, TRUE, '[]')
ON CONFLICT (id) DO NOTHING;

-- 6. Problems
INSERT INTO problems (id, problem_number, title, description, category, assigned_team, assigned_agent_name, root_cause, workaround, is_known_error, status, created_at, updated_at)
VALUES
('prb-1', 'PRB-2001', 'Palo Alto PA-5250 IPSec Tunnel MTU Degradation under High Traffic', 'High packet loss on remote VPN gateways during peak morning login windows caused by MSS clamping conflicts.', 'NETWORK', 'Infrastructure & Network L3', 'Marcus Vance', 'Carrier transit path recently enabled strict 1420 MTU path while Palo Alto tunnel interface retained 1500 byte defaults.', 'Instruct users to connect via US-East secondary endpoint or lower local interface MTU to 1380 bytes.', TRUE, 'UNDER_INVESTIGATION', NOW() - INTERVAL '2 days', NOW() - INTERVAL '25 minutes'),
('prb-2', 'PRB-2002', 'macOS Sequoia DisplayLink Dock Driver Kernel Instability', 'Repeated kernel panic crash loops when sleep/wake cycles occur while dual DisplayLink USB-C displays are connected.', 'HARDWARE', 'Desktop Support L2', 'Marcus Vance', 'Vendor extension kext memory leak in DisplayLink Manager v1.10.0 on Darwin 24.0.0.', 'Downgrade DisplayLink driver to v1.9.2 or use single native Thunderbolt display connection.', TRUE, 'KNOWN_ERROR', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 7. Changes
INSERT INTO change_requests (
    id, change_number, title, description, reason, change_type, risk, impact, affected_service,
    implementation_plan, rollback_plan, test_plan, requester_name, assigned_owner_name, approval_status,
    approver_name, approval_comments, implementation_status, scheduled_start, scheduled_end, created_at, updated_at
)
VALUES
(
    'chg-1', 'CHG-3001', 'Upgrade Palo Alto PA-5250 PAN-OS to 11.1.2-h3 and Enable Dynamic MSS Clamping',
    'Apply security maintenance patch and configure tunnel interface MTU clamping to resolve upstream carrier fragmentation.',
    'Addresses root cause identified in PRB-2001 affecting remote workforce VPN stability.',
    'NORMAL', 'MEDIUM', 'MEDIUM', 'Enterprise VPN Access',
    '1. Failover primary firewall traffic to standby passive cluster member. 2. Verify traffic stability. 3. Upgrade primary unit. 4. Reboot primary. 5. Failback.',
    'Switch traffic back to unmodified passive node via VRRP priority election if packet loss exceeds 0.5%.',
    'Run synthetic TCP/UDP iperf3 throughput tests and verify MTU negotiation across 10 test endpoints.',
    'Marcus Vance', 'David Kim', 'PENDING', NULL, NULL, 'SCHEDULED',
    NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 3 hours', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Knowledge Articles
INSERT INTO knowledge_articles (id, article_number, title, summary, content, category, author_name, status, view_count, helpful_count, created_at, updated_at)
VALUES
('kb-1', 'KB-00101', 'Troubleshooting GlobalProtect VPN Connection and MTU Issues', 'Step-by-step resolution for remote staff experiencing intermittent VPN disconnects or gateway timeouts.', 'Follow certified MTU clamping: sudo networksetup -setMTU en0 1380 or switch gateway profile to US-East.', 'Network & Connectivity', 'Marcus Vance', 'PUBLISHED', 428, 89, NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days'),
('kb-2', 'KB-00102', 'Resolving DisplayLink Dock Crashes on macOS Sequoia', 'Fix for external multi-monitor kernel panics on Apple Silicon laptops.', 'Download certified driver package DisplayLink Manager v1.9.2 (Legacy Stable) from Self-Service portal.', 'Hardware & Peripherals', 'Marcus Vance', 'PUBLISHED', 312, 64, NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;
