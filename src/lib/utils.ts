import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'

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

export function getAnswerOptions(correctRomanji: string, count: number, type: WritingSystem): string[] {
    const wrongOptions: string[] = []
    const filteredRomanji = WRITING_SYSTEMS_DATA[type].map((h) => h.romanji).filter((r) => r !== correctRomanji)
    while (wrongOptions.length < count) {
        const randomOption = filteredRomanji[Math.floor(Math.random() * filteredRomanji.length)]
        if (!wrongOptions.includes(randomOption)) {
            wrongOptions.push(randomOption)
        }
    }
    return shuffleArray([correctRomanji, ...wrongOptions])
}
