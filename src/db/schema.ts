import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('EMPLOYEE'),
  department: text('department').notNull().default('Engineering'),
  team: text('team'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const incidents = pgTable('incidents', {
  id: text('id').primaryKey(),
  incidentNumber: text('incident_number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requesterId: text('requester_id').notNull(),
  requesterName: text('requester_name').notNull(),
  requesterEmail: text('requester_email').notNull(),
  requesterDepartment: text('requester_department').notNull(),
  assignedAgentId: text('assigned_agent_id'),
  assignedAgentName: text('assigned_agent_name'),
  assignmentGroup: text('assignment_group').notNull().default('Service Desk L1'),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
  impact: text('impact').notNull(),
  urgency: text('urgency').notNull(),
  priority: text('priority').notNull(),
  status: text('status').notNull().default('NEW'),
  source: text('source').notNull().default('PORTAL'),
  affectedAssetId: text('affected_asset_id'),
  affectedAssetName: text('affected_asset_name'),
  affectedService: text('affected_service'),
  relatedProblemId: text('related_problem_id'),
  resolutionNotes: text('resolution_notes'),
  pendingReason: text('pending_reason'),
  slaJson: text('sla_json'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const incidentComments = pgTable('incident_comments', {
  id: text('id').primaryKey(),
  incidentId: text('incident_id').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  content: text('content').notNull(),
  isInternalWorkNote: boolean('is_internal_work_note').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
