import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api } from '@/convex/_generated/api'
import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn } from '@/lib/utils'

const GOJUON_ORDER = [
    ['a', 'i', 'u', 'e', 'o'],
    ['ka', 'ki', 'ku', 'ke', 'ko'],
    ['sa', 'shi', 'su', 'se', 'so'],
    ['ta', 'chi', 'tsu', 'te', 'to'],
    ['na', 'ni', 'nu', 'ne', 'no'],
    ['ha', 'hi', 'fu', 'he', 'ho'],
    ['ma', 'mi', 'mu', 'me', 'mo'],
    ['ya', '', 'yu', '', 'yo'],
    ['ra', 'ri', 'ru', 're', 'ro'],
    ['wa', '', '', '', 'wo'],
    ['n', '', '', '', '']
]

export function CharacterChart({ writingSystem }: { writingSystem: WritingSystem }) {
    const { userId } = useAuth()
    const resetProgress = useMutation(api.progress.reset)
    const progressData = useQuery(api.progress.getProgress, userId ? { writingSystem } : 'skip')

    const progressMap = new Map(progressData?.map((p) => [p.romanji, { tested: p.tested }]) ?? [])
    const charMap = new Map(WRITING_SYSTEMS_DATA[writingSystem].map((item) => [item.romanji, item.character]))

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                {GOJUON_ORDER.map((row, rowIndex) =>
                    row.map((romanji, colIndex) => {
                        const character = charMap.get(romanji)
                        const isEmpty = !romanji
                        const progress = romanji ? progressMap.get(romanji) : undefined
                        const score = progress?.tested ?? 0
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={cn(
                                    isEmpty && 'invisible',
                                    !isEmpty &&
                                        'relative flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-linear-to-br p-3 transition-all duration-200 hover:shadow-md',
                                    !isEmpty &&
                                        (writingSystem === 'hiragana'
                                            ? 'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
                                            : 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100')
                                )}
                            >
                                {!isEmpty && (
                                    <>
                                        <div className="flex flex-1 items-center justify-center">
                                            <div
                                                className={cn(
                                                    'text-2xl leading-none font-bold',
                                                    writingSystem === 'hiragana' ? 'text-purple-900' : 'text-blue-900'
                                                )}
                                            >
                                                {character}
                                            </div>
                                        </div>
                                        <Progress
                                            value={(score / 7) * 100}
                                            className={cn(
                                                'h-1.5 w-full',
                                                score >= 6 ? '[&>div]:bg-green-600' : score >= 3 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                                            )}
                                        />
                                    </>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <Button variant="destructive" onClick={() => resetProgress({ writingSystem })}>
                Reset Scores
            </Button>
        </div>
    )
}
