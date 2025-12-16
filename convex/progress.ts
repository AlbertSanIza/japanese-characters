import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { WRITING_SYSTEM } from './schema'
import { getUserIdentity } from './utils'

export const getProgress = query({
    args: { writingSystem: WRITING_SYSTEM },
    async handler(ctx, { writingSystem }) {
        const identity = await getUserIdentity(ctx)
        return await ctx.db
            .query('progress')
            .withIndex('by_userId_writingSystem', (q) => q.eq('userId', identity.subject).eq('writingSystem', writingSystem))
            .collect()
    }
})

export const answer = mutation({
    args: { writingSystem: WRITING_SYSTEM, romanji: v.string(), isCorrect: v.boolean() },
    async handler(ctx, { writingSystem, romanji, isCorrect }) {
        const identity = await getUserIdentity(ctx)
        const existingProgress = await ctx.db
            .query('progress')
            .withIndex('by_userId_writingSystem_romanji', (q) => q.eq('userId', identity.subject).eq('writingSystem', writingSystem).eq('romanji', romanji))
            .unique()
        if (existingProgress) {
            await ctx.db.patch(existingProgress._id, { tested: Math.max(0, Math.min(4, existingProgress.tested + (isCorrect ? 1 : -2))) })
            return
        }
        await ctx.db.insert('progress', { userId: identity.subject, writingSystem, romanji, tested: isCorrect ? 1 : 0 })
    }
})

export const reset = mutation({
    args: { writingSystem: WRITING_SYSTEM },
    async handler(ctx, { writingSystem }) {
        const identity = await getUserIdentity(ctx)
        const records = await ctx.db
            .query('progress')
            .withIndex('by_userId_writingSystem', (q) => q.eq('userId', identity.subject).eq('writingSystem', writingSystem))
            .collect()
        for (const record of records) {
            await ctx.db.delete(record._id)
        }
    }
})
