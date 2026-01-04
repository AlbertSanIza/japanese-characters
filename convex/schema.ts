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
        .index('by_userId_writingSystem_romanji', ['userId', 'writingSystem', 'romanji']),
    
    speedChallenges: defineTable({
        userId: v.string(),
        writingSystem: WRITING_SYSTEM,
        score: v.number(),
        time: v.number(),
        accuracy: v.number(),
        maxCombo: v.number(),
        date: v.number()
    })
        .index('by_userId_writingSystem', ['userId', 'writingSystem'])
        .index('by_writingSystem_score', ['writingSystem', 'score']),
    
    memoryGameScores: defineTable({
        userId: v.string(),
        writingSystem: WRITING_SYSTEM,
        gridSize: v.union(v.literal('small'), v.literal('medium'), v.literal('large')),
        time: v.number(),
        moves: v.number(),
        date: v.number()
    })
        .index('by_userId_writingSystem', ['userId', 'writingSystem'])
        .index('by_writingSystem_gridSize_time', ['writingSystem', 'gridSize', 'time'])
})
