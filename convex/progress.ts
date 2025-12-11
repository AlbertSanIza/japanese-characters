import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { WRITING_SYSTEM } from './schema'

export const getProgress = query({
    args: { writingSystem: WRITING_SYSTEM },
    async handler(ctx, { writingSystem }) {
        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not Authenticated')
        }
        return await ctx.db
            .query('progress')
            .withIndex('by_userId_writingSystem', (q) => q.eq('userId', identity.subject).eq('writingSystem', writingSystem))
            .collect()
    }
})

export const answer = mutation({
    args: { writingSystem: WRITING_SYSTEM, romanji: v.string(), isCorrect: v.boolean() },
    async handler(ctx, { writingSystem, romanji, isCorrect }) {
        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not Authenticated')
        }
        const existing = await ctx.db
            .query('progress')
            .withIndex('by_userId_writingSystem_romanji', (q) => q.eq('userId', identity.subject).eq('writingSystem', writingSystem).eq('romanji', romanji))
            .unique()
        if (existing) {
            const tested = Math.min(10, existing.tested + 1)
            const correct = Math.max(0, Math.min(10, existing.correct + (isCorrect ? 1 : -1)))
            await ctx.db.patch(existing._id, { tested, correct })
            return
        }
        await ctx.db.insert('progress', { userId: identity.subject, writingSystem, romanji, tested: 1, correct: isCorrect ? 1 : 0 })
    }
})

export const reset = mutation({
    args: { writingSystem: WRITING_SYSTEM },
    async handler(ctx, { writingSystem }) {
        const identity = await ctx.auth.getUserIdentity()
        if (identity === null) {
            throw new Error('Not Authenticated')
        }
        const records = await ctx.db
            .query('progress')
            .withIndex('by_userId_writingSystem', (q) => q.eq('userId', identity.subject).eq('writingSystem', writingSystem))
            .collect()

        for (const record of records) {
            await ctx.db.delete(record._id)
        }
    }
})
