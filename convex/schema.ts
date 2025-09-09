import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.union(v.literal("user"), v.literal("caregiver"), v.literal("admin")),
    // TODO: if we want to have an array here, we probably want to create a separate table for that
    associatedUser: v.optional(v.id("users")), // for caregivers users, the user they are associated with
  })
    .index("email", ["email"])
    .index("associatedUser", ["associatedUser"]),
  emergencies: defineTable({
    fromUser: v.id("users"),
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),
    description: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("solved")),
    notifications: v.optional(v.array(v.string())),
  }).index("fromUser", ["fromUser"]),
});

export default schema;
