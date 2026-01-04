import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { WRITING_SYSTEM } from './schema'
import { getUserIdentity } from './utils'

const GRID_SIZE = v.union(v.literal('small'), v.literal('medium'), v.literal('large'))

export const saveScore = mutation({
    args: {
        writingSystem: WRITING_SYSTEM,
        gridSize: GRID_SIZE,
        time: v.number(),
        moves: v.number()
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const identity = await getUserIdentity(ctx)
        await ctx.db.insert('memoryGameScores', {
            userId: identity.subject,
            writingSystem: args.writingSystem,
            gridSize: args.gridSize,
            time: args.time,
            moves: args.moves,
            date: Date.now()
        })
        return null
    }
})

export const getLeaderboard = query({
    args: {
        writingSystem: WRITING_SYSTEM,
        gridSize: GRID_SIZE,
        limit: v.optional(v.number())
    },
    returns: v.array(
        v.object({
            _id: v.id('memoryGameScores'),
            _creationTime: v.number(),
            userId: v.string(),
            writingSystem: WRITING_SYSTEM,
            gridSize: GRID_SIZE,
            time: v.number(),
            moves: v.number(),
            date: v.number()
        })
    ),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10
        return await ctx.db
            .query('memoryGameScores')
            .withIndex('by_writingSystem_gridSize_time', (q) =>
                q.eq('writingSystem', args.writingSystem).eq('gridSize', args.gridSize)
            )
            .order('asc')
            .take(limit)
    }
})

export const getPersonalBest = query({
    args: { writingSystem: WRITING_SYSTEM, gridSize: GRID_SIZE },
    returns: v.union(
        v.object({
            _id: v.id('memoryGameScores'),
            _creationTime: v.number(),
            userId: v.string(),
            writingSystem: WRITING_SYSTEM,
            gridSize: GRID_SIZE,
            time: v.number(),
            moves: v.number(),
            date: v.number()
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const identity = await getUserIdentity(ctx)
        const scores = await ctx.db
            .query('memoryGameScores')
            .withIndex('by_userId_writingSystem', (q) =>
                q.eq('userId', identity.subject).eq('writingSystem', args.writingSystem)
            )
            .collect()
        
        const filteredScores = scores.filter((s) => s.gridSize === args.gridSize)
        
        if (filteredScores.length === 0) return null
        
        return filteredScores.reduce((best, current) => {
            return current.time < best.time ? current : best
        })
    }
})
