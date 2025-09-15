import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateCode = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "user") {
      throw new Error("Only users can generate connection codes");
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 24 hours from now
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

    // Update user with new connection code
    await ctx.db.patch(userId, {
      connectionCode: code,
      connectionCodeExpiresAt: expiresAt,
    });

    return { code, expiresAt };
  },
});

export const connectCaregiver = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const caregiverId = await getAuthUserId(ctx);
    if (!caregiverId) {
      throw new Error("Not authenticated");
    }

    const caregiver = await ctx.db.get(caregiverId);
    if (!caregiver || caregiver.role !== "caregiver") {
      throw new Error("Only caregivers can use connection codes");
    }

    // Find user with this connection code
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("connectionCode"), args.code))
      .collect();

    if (users.length === 0) {
      throw new Error("Código inválido");
    }

    const user = users[0];

    // Check if code is expired
    if (!user.connectionCodeExpiresAt || user.connectionCodeExpiresAt < Date.now()) {
      throw new Error("Este código ha expirado");
    }

    // Update caregiver with associated user
    await ctx.db.patch(caregiverId, {
      associatedUser: user._id,
    });

    // Clear the connection code from the user
    await ctx.db.patch(user._id, {
      connectionCode: undefined,
      connectionCodeExpiresAt: undefined,
    });

    return { success: true };
  },
});