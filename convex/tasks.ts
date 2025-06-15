import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { randomUUID } from "crypto";

export const getThreads = query({
  args: { userId: v.string(), numItems: v.number(), cursor: v.optional(v.string()) },
  handler: async ( ctx, args ) => {
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_userId", q => q.eq("userId", args.userId))
      .paginate({ numItems: args.numItems, cursor: args.cursor ?? null });
    return threads;
  }
});

export const getMessages = query({
  args: { threadId: v.id("threads"), numItems: v.number(), cursor: v.optional(v.string()) },
  handler: async ( ctx, args ) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_threadId", q => q.eq("threadId", args.threadId))
      .paginate({ numItems: args.numItems, cursor: args.cursor ?? null });
    return messages;
  }
})

export const createThread = mutation({
  args: {title: v.string(), parentThreadId: v.optional(v.id("threads"))},
  handler: async ( ctx, args ) => {
    const userId = "";
    const threadId = await ctx.db.insert("threads", {
      threadId: randomUUID().toLowerCase(),
      title: "New Thread",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastMessageAt: Date.now(),
      archived: false,
      generationState: "pending",
      modelId: "default-model",
      userId: userId,
      pinned: false,
      parentThreadId: args.parentThreadId,
      branchOff: false,
      titleSetByUser: false,
    });
    return threadId;
  }
});

export const renameThread = mutation({
  args: { threadId: v.id("threads"), title: v.string() },
  handler: async ( ctx, args ) => {
    await ctx.db.patch(args.threadId, {
      title: args.title,
      updatedAt: Date.now(),
      titleSetByUser: true,
    });
    return true;
  }
});

export const archiveThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async ( ctx, args ) => {
    await ctx.db.patch(args.threadId, {
      archived: true,
      updatedAt: Date.now(),
    });
    return true;
  }
});

export const unarchiveThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async ( ctx, args ) => {
    await ctx.db.patch(args.threadId, {
      archived: false,
      updatedAt: Date.now(),
    });
    return true;
  }
});

export const branchOffThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async ( ctx, args ) => {
    await ctx.db.patch(args.threadId, {
      branchOff: true,
      updatedAt: Date.now(),
    });
    return true;
  }
});

export const pinThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async ( ctx, args ) => {
    await ctx.db.patch(args.threadId, {
      pinned: true,
      updatedAt: Date.now(),
    });
    return true;
  }
});

export const unpinThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async ( ctx, args ) => {
    await ctx.db.patch(args.threadId, {
      pinned: false,
      updatedAt: Date.now(),
    });
    return true;
  }
});

export const deleteThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async ( ctx, args ) => {
    const threadId = await ctx.db.get(args.threadId);
    await ctx.db.delete(args.threadId);
    return threadId;
  }
});