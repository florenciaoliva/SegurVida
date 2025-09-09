import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

// Get all available caregivers
export const getAvailableCaregivers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all users with role "caregiver"
    const caregivers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "caregiver"))
      .collect();

    return caregivers;
  },
});

// Get caregivers associated with the current user
export const getMyCaregiversList = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get caregivers that have this user as their associatedUser
    const caregivers = await ctx.db
      .query("users")
      .withIndex("associatedUser", (q) => q.eq("associatedUser", userId))
      .collect();

    return caregivers;
  },
});

// Update the caregivers associated with a user
export const updateMyCaregiversList = mutation({
  args: {
    caregiverIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // First, remove all existing associations
    const existingCaregivers = await ctx.db
      .query("users")
      .withIndex("associatedUser", (q) => q.eq("associatedUser", userId))
      .collect();

    for (const caregiver of existingCaregivers) {
      await ctx.db.patch(caregiver._id, {
        associatedUser: undefined,
      });
    }

    // Then, add the new associations
    for (const caregiverId of args.caregiverIds) {
      const caregiver = await ctx.db.get(caregiverId);
      if (caregiver && caregiver.role === "caregiver") {
        await ctx.db.patch(caregiverId, {
          associatedUser: userId,
        });
      }
    }

    return { success: true };
  },
});

// Update user profile information
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;

    await ctx.db.patch(userId, updates);

    return { success: true };
  },
});
