import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { WRITING_SYSTEM } from './schema'
import { getUserIdentity } from './utils'

export const saveScore = mutation({
    args: {
        writingSystem: WRITING_SYSTEM,
        score: v.number(),
        time: v.number(),
        accuracy: v.number(),
        maxCombo: v.number()
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const identity = await getUserIdentity(ctx)
        await ctx.db.insert('speedChallenges', {
            userId: identity.subject,
            writingSystem: args.writingSystem,
            score: args.score,
            time: args.time,
            accuracy: args.accuracy,
            maxCombo: args.maxCombo,
            date: Date.now()
        })
        return null
    }
})

export const getLeaderboard = query({
    args: { writingSystem: WRITING_SYSTEM, limit: v.optional(v.number()) },
    returns: v.array(
        v.object({
            _id: v.id('speedChallenges'),
            _creationTime: v.number(),
            userId: v.string(),
            writingSystem: WRITING_SYSTEM,
            score: v.number(),
            time: v.number(),
            accuracy: v.number(),
            maxCombo: v.number(),
            date: v.number()
        })
    ),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10
        return await ctx.db
            .query('speedChallenges')
            .withIndex('by_writingSystem_score', (q) => q.eq('writingSystem', args.writingSystem))
            .order('desc')
            .take(limit)
    }
})

export const getPersonalBest = query({
    args: { writingSystem: WRITING_SYSTEM },
    returns: v.union(
        v.object({
            _id: v.id('speedChallenges'),
            _creationTime: v.number(),
            userId: v.string(),
            writingSystem: WRITING_SYSTEM,
            score: v.number(),
            time: v.number(),
            accuracy: v.number(),
            maxCombo: v.number(),
            date: v.number()
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const identity = await getUserIdentity(ctx)
        const scores = await ctx.db
            .query('speedChallenges')
            .withIndex('by_userId_writingSystem', (q) =>
                q.eq('userId', identity.subject).eq('writingSystem', args.writingSystem)
            )
            .collect()
        
        if (scores.length === 0) return null
        
        return scores.reduce((best, current) => {
            return current.score > best.score ? current : best
        })
    }
})
