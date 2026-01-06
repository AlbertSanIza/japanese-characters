import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react'
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useState } from 'react'

import { CharacterChart } from '@/components/CharacterChart'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn, getAnswerOptions, shuffleArray } from '@/lib/utils'

interface QuizModeProps {
    writingSystem: WritingSystem
    onBack: () => void
}

export function QuizMode({ writingSystem, onBack }: QuizModeProps) {
    const { userId } = useAuth()
    const answer = useMutation(api.progress.answer)
    const [box, setBox] = useState({ size: 0, isWide: false })
    const progressData = useQuery(api.progress.getProgress, userId ? { writingSystem } : 'skip')
    const [deck, setDeck] = useState(() => shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
    const [index, setIndex] = useState(0)
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(true)

    const current = deck[index]
    const options = useMemo(() => getAnswerOptions(current.romanji, 3, writingSystem), [current.romanji, writingSystem])
    const earnedPoints = progressData?.reduce((sum, characterProgress) => sum + characterProgress.tested, 0) ?? 0
    const totalPoints = WRITING_SYSTEMS_DATA[writingSystem].length * 4
    const progress = Math.min(100, Math.max(0, (earnedPoints / totalPoints) * 100))

    useEffect(() => {
        setDeck(shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
        setIndex(0)
    }, [writingSystem])

    useEffect(() => {
        const container = document.getElementById('quiz-box-container')
        if (!container) {
            return
        }
        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect()
            setBox({ size: Math.min(width, height), isWide: width > height })
        })
        resizeObserver.observe(container)
        return () => resizeObserver.disconnect()
    }, [])

    const handleOptionClick = (isSignedIn: boolean, isValid: boolean) => {
        if (isSignedIn && isAnswerCorrect) {
            answer({ writingSystem, romanji: current.romanji, isCorrect: isValid })
        }
        setIsAnswerCorrect(isValid)
        if (!isValid) {
            return
        }
        setIndex((prevIndex) => {
            if (prevIndex + 1 >= deck.length) {
                setDeck(shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
                return 0
            }
            return prevIndex + 1
        })
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-stone-100 p-6 md:p-12">
            <div className="flex w-full items-center gap-6">
                <Button variant="outline" onClick={onBack}>
                    ← Modes
                </Button>
                <Progress
                    value={progress}
                    className={cn(
                        'flex-1',
                        progress >= 100
                            ? '[&>div]:bg-green-600'
                            : progress >= 50
                              ? '[&>div]:bg-yellow-500'
                              : progress > 0
                                ? '[&>div]:bg-red-500'
                                : '[&>div]:bg-slate-200'
                    )}
                />
                <AuthLoading>
                    <div className="flex size-7 items-center justify-center rounded-full bg-stone-200">
                        <Spinner />
                    </div>
                </AuthLoading>
                <Authenticated>
                    <div className="flex size-7 items-center rounded-full bg-slate-200">
                        <UserButton />
                    </div>
                </Authenticated>
                <Unauthenticated>
                    <Tooltip defaultOpen={true}>
                        <TooltipTrigger asChild>
                            <Button asChild>
                                <SignInButton />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="end">
                            Sign in to track your progress!
                        </TooltipContent>
                    </Tooltip>
                </Unauthenticated>
            </div>
            <div className="flex w-full flex-1 gap-6">
                <CharacterChart writingSystem={writingSystem} activeRomanji={current.romanji} />
                <div className="flex flex-1 flex-col items-center justify-center">
                    <div id="quiz-box-container" className="flex w-full flex-1 items-center justify-center">
                        <div
                            className="flex size-full max-h-full max-w-full items-center justify-center"
                            style={{
                                [box.isWide ? 'width' : 'height']: `${box.size}px`,
                                fontSize: `${box.size * 0.6}px`
                            }}
                        >
                            {current.character}
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-4 md:w-fit md:grid-cols-4 md:gap-6">
                        {options.map((option) => (
                            <Button
                                size="lg"
                                key={option}
                                disabled={!isAnswerCorrect && option !== current.romanji}
                                onClick={() => handleOptionClick(!!userId, option === current.romanji)}
                                variant={!isAnswerCorrect && option !== current.romanji ? 'destructive' : 'outline'}
                                className={cn(
                                    'h-16 rounded-3xl border text-3xl font-bold md:h-26 md:px-10 md:text-6xl md:font-normal',
                                    !isAnswerCorrect && option !== current.romanji && 'opacity-10!',
                                    !isAnswerCorrect && option === current.romanji && 'border-green-600 bg-green-100 hover:bg-green-50'
                                )}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
