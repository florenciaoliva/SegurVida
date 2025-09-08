import { getAuthUserId } from "@convex-dev/auth/server";
import { PushNotifications } from "@convex-dev/expo-push-notifications";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";

const pushNotifications = new PushNotifications(components.pushNotifications);

export default pushNotifications;

export const recordPushNotificationToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    await pushNotifications.recordToken(ctx, {
      userId,
      pushToken: args.token,
    });
  },
});

export const sendPushNotification = internalMutation({
  args: {
    title: v.string(),
    body: v.optional(v.string()),
    to: v.id("users"),
    priority: v.optional(v.union(v.literal("default"), v.literal("normal"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const notificationId = await pushNotifications.sendPushNotification(ctx, {
      userId: args.to,
      notification: {
        title: args.title,
        body: args.body,
        priority: args.priority,
      },
    });

    return notificationId;
  },
});
