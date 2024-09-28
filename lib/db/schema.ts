import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeProductId: text("stripe_product_id"),
  planName: varchar("plan_name", { length: 50 }),
  subscriptionStatus: varchar("subscription_status", { length: 20 }),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  role: varchar("role", { length: 50 }).notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  invitedBy: integer("invited_by")
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp("invited_at").notNull().defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, "id" | "name" | "email">;
  })[];
};

export enum ActivityType {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  CREATE_TEAM = "CREATE_TEAM",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
  CREATE_SITE = "CREATE_SITE",
  UPDATE_SITE = "UPDATE_SITE",
  DELETE_SITE = "DELETE_SITE",
  CREATE_POST_TYPE = "CREATE_POST_TYPE",
  UPDATE_POST_TYPE = "UPDATE_POST_TYPE",
  DELETE_POST_TYPE = "DELETE_POST_TYPE",
  CREATE_POST = "CREATE_POST",
  UPDATE_POST = "UPDATE_POST",
  DELETE_POST = "DELETE_POST",
  UPLOAD_MEDIA = "UPLOAD_MEDIA",
  DELETE_MEDIA = "DELETE_MEDIA",
}

export const sites = pgTable(
  "sites",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id),
    name: varchar("name", { length: 100 }).notNull(),
    domain: varchar("domain", { length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    settings: jsonb("settings"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      domainIdx: uniqueIndex("domain_idx").on(table.domain),
    };
  }
);

export const postTypes = pgTable(
  "post_types",
  {
    id: serial("id").primaryKey(),
    siteId: integer("site_id")
      .notNull()
      .references(() => sites.id),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: text("description"),
    fields: jsonb("fields").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex("slug_idx").on(table.siteId, table.slug),
    };
  }
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    postTypeId: integer("post_type_id")
      .notNull()
      .references(() => postTypes.id),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: jsonb("content").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    publishedAt: timestamp("published_at"),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex("slug_idx").on(table.postTypeId, table.slug),
    };
  }
);

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .notNull()
    .references(() => sites.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: integer("file_size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sitesRelations = relations(sites, ({ one, many }) => ({
  team: one(teams, { fields: [sites.teamId], references: [teams.id] }),
  postTypes: many(postTypes),
  media: many(media),
}));

export const postTypesRelations = relations(postTypes, ({ one, many }) => ({
  site: one(sites, { fields: [postTypes.siteId], references: [sites.id] }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  postType: one(postTypes, {
    fields: [posts.postTypeId],
    references: [postTypes.id],
  }),
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  site: one(sites, { fields: [media.siteId], references: [sites.id] }),
}));

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
export type PostType = typeof postTypes.$inferSelect;
export type NewPostType = typeof postTypes.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
