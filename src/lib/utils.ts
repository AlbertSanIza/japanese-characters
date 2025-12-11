import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}
if (!import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL) {
    throw new Error('Missing Clerk Sign In Force Redirect URL')
}
if (!import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL) {
    throw new Error('Missing Clerk Sign Up Force Redirect URL')
}
if (!import.meta.env.VITE_CLERK_AFTER_SIGN_OUT_URL) {
    throw new Error('Missing Clerk After Sign Out URL')
}

export const VITE_CLERK_PUBLISHABLE_KEY: string = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
export const VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL: string = import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
export const VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL: string = import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL
export const VITE_CLERK_AFTER_SIGN_OUT_URL: string = import.meta.env.VITE_CLERK_AFTER_SIGN_OUT_URL

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}
