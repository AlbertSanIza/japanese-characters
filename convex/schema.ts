import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const WRITING_SYSTEM = v.union(v.literal('hiragana'), v.literal('katakana'))

export default defineSchema({
    progress: defineTable({
        userId: v.string(),
        writingSystem: WRITING_SYSTEM,
        romanji: v.string(),
        tested: v.number()
    })
        .index('by_userId_writingSystem', ['userId', 'writingSystem'])
        .index('by_userId_writingSystem_romanji', ['userId', 'writingSystem', 'romanji'])
})
