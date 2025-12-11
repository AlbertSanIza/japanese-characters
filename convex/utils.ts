import type { UserIdentity } from 'convex/server'

export const getUserIdentity = async <T extends { auth: { getUserIdentity: () => Promise<UserIdentity | null> } }>(ctx: T) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
        throw new Error('Not Authenticated')
    }
    return identity
}
