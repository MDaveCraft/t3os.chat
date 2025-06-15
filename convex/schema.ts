import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  threads: defineTable({
    threadId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.number(),
    archived: v.boolean(),
    generationState: v.union(
      v.literal("generating"),
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    modelId: v.string(),
    userId: v.string(),
    pinned: v.boolean(),
    parentThreadId: v.optional(v.id("threads")),
    branchOff: v.boolean(),
    titleSetByUser: v.boolean(),
  }).index("by_userId", ["userId"])
    .index("by_threadId_and_userId", ["threadId", "userId"])
    .searchIndex("by_title", {
      searchField: "title",
      filterFields: ["userId"],
    }),

  messages: defineTable({
    messageId: v.string(),
    threadId: v.id("threads"),
    userId: v.string(),
    fileKey: v.string(),
    modelId: v.string(),
    type: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    attachments: v.id("attachments"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    branches: v.optional(v.array(v.id("threads"))),
    error: v.optional(
      v.object({
        type: v.string(),
        message: v.string(),
      })
    ),
  }).index("by_threadId", ["threadId"])
    .index("by_userId", ["userId"])
    .index("by_threadId_and_userId", ["threadId", "userId"]),

  attachments: defineTable({
    attachmentId: v.string(),
    threadId: v.id("threads"),
    userId: v.string(),
    attachmentType: v.string(),
    fileName: v.string(),
    size: v.number(),
    url: v.string(),
    state: v.union(
      v.literal("pending"),
      v.literal("uploaded"),
      v.literal("failed"),
      v.literal("deleted")
    ),
    uploadedAt: v.number(),
  }).index("by_threadId", ["threadId"])
    .index("by_userId", ["userId"]),
});