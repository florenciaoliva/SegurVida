import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

export const createEmergencyWorkflow = mutation({
  args: {
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<string> => {
    const fromUser = await getAuthUserId(ctx);
    if (!fromUser) {
      throw new Error("User not found");
    }
    const toUsers = await ctx.db
      .query("users")
      .withIndex("associatedUser", (q) => q.eq("associatedUser", fromUser))
      .collect();

    const notificationIds: string[] = [];

    // 1. check if we don't have an emergency already for this user
    const existingEmergency = await ctx.db
      .query("emergencies")
      .filter((q) => q.eq(q.field("fromUser"), fromUser))
      .first();

    if (existingEmergency) {
      for (const toUser of toUsers) {
        const notificationId = await ctx.runMutation(internal.notifications.sendPushNotification, {
          title: "Emergencia",
          body: args.description || "Emergency, needs help!",
          to: toUser._id,
        });

        if (!notificationId) {
          throw new Error("Failed to create notification");
        }

        notificationIds.push(notificationId);
      }

      // 2. add notification to emergency
      await ctx.runMutation(internal.emergencies.updateNotifications, {
        emergencyId: existingEmergency._id,
        notificationIds,
      });

      return existingEmergency._id;
    }

    // 1. create emergency
    const emergencyId = await ctx.db.insert("emergencies", {
      fromUser: fromUser,
      location: args.location,
      description: args.description,
      status: "pending",
    });

    for (const toUser of toUsers) {
      // 2. create notification
      const notificationId = await ctx.runMutation(internal.notifications.sendPushNotification, {
        title: "Emergencia",
        to: toUser._id,
        body: args.description || "Emergency, needs help!",
      });

      if (!notificationId) {
        throw new Error("Failed to create notification");
      }

      notificationIds.push(notificationId);
    }
    // 3. update emergency
    await ctx.runMutation(internal.emergencies.updateNotifications, {
      emergencyId,
      notificationIds,
    });

    return emergencyId;
  },
});

export const updateNotifications = internalMutation({
  args: {
    emergencyId: v.id("emergencies"),
    notificationIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existingEmergency = await ctx.db.get(args.emergencyId);
    if (!existingEmergency) {
      throw new Error("Emergency not found");
    }

    await ctx.db.patch(args.emergencyId, {
      notifications: [...(existingEmergency.notifications || []), ...args.notificationIds],
    });
  },
});

export const getCurrentActiveEmergency = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    return await ctx.db
      .query("emergencies")
      .withIndex("fromUser", (q) => q.eq("fromUser", userId))
      .filter((q) => q.not(q.eq(q.field("status"), "solved")))
      .first();
  },
});
