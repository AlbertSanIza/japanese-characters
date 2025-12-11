import { useAuth } from '@clerk/clerk-react'
import { Authenticated, useMutation, useQuery } from 'convex/react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
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

export function CharacterChart({ writingSystem, activeRomanji }: { writingSystem: WritingSystem; activeRomanji?: string }) {
    const { userId } = useAuth()
    const resetProgress = useMutation(api.progress.reset)
    const progressData = useQuery(api.progress.getProgress, userId ? { writingSystem } : 'skip')

    const progressMap = new Map(progressData?.map((p) => [p.romanji, { tested: p.tested }]) ?? [])
    const charMap = new Map(WRITING_SYSTEMS_DATA[writingSystem].map((item) => [item.romanji, item.character]))

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-5 gap-0.5">
                {GOJUON_ORDER.map((row, rowIndex) =>
                    row.map((romanji, colIndex) => {
                        const isEmpty = !romanji
                        if (isEmpty) {
                            return <div key={`${rowIndex}-${colIndex}`} className="invisible" />
                        }
                        const score = progressMap.get(romanji)?.tested ?? 0
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={cn(
                                    'rounded-md border border-transparent p-2 transition-[color,box-shadow]',
                                    romanji === activeRomanji && 'border border-input bg-slate-50 shadow-xs'
                                )}
                            >
                                <div className="text-b pb-0.5 text-3xl leading-none font-light">{charMap.get(romanji)}</div>
                                <Progress
                                    value={(score / 7) * 100}
                                    className={cn(
                                        'h-1.5',
                                        score >= 7
                                            ? '[&>div]:bg-green-600'
                                            : score >= 3
                                              ? '[&>div]:bg-yellow-500'
                                              : score > 0
                                                ? '[&>div]:bg-red-500'
                                                : '[&>div]:bg-slate-200'
                                    )}
                                />
                            </div>
                        )
                    })
                )}
            </div>
            <Authenticated>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                            Reset Progress
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently reset your progress for the <b>{writingSystem}</b> writing system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => resetProgress({ writingSystem })}>Reset</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Authenticated>
        </div>
    )
}
