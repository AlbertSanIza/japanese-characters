import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    progress: defineTable({
        userId: v.string(),
        writingSystem: v.string(),
        romanji: v.string(),
        tested: v.number(),
        correct: v.number()
    })
        .index('by_userId_writingSystem_romanji', ['userId', 'writingSystem', 'romanji'])
        .index('by_userId_writingSystem', ['userId', 'writingSystem'])
})
