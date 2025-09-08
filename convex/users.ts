import { v } from "convex/values";
import { query } from "./_generated/server";

// TODO: update users table to include associatedCaregivers relation
const associatedCaregivers = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").collect();
  },
});
