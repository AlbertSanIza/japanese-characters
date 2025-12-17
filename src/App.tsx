import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react'
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useState } from 'react'

import { CharacterChart } from '@/components/CharacterChart'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn, getAnswerOptions, shuffleArray } from '@/lib/utils'

export default function App() {
    const { userId } = useAuth()
    const answer = useMutation(api.progress.answer)
    const [box, setBox] = useState({ width: 0, height: 0, size: 0 })
    const [writingSystem, setWritingSystem] = useState<WritingSystem>('hiragana')
    const progressData = useQuery(api.progress.getProgress, userId ? { writingSystem } : 'skip')
    const [deck, setDeck] = useState(() => shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
    const [index, setIndex] = useState(0)
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(true)

    const current = deck[index]
    const options = useMemo(() => getAnswerOptions(current.romanji, 3, writingSystem), [current.romanji, writingSystem])
    const earnedPoints = progressData?.reduce((sum, characterProgress) => sum + characterProgress.tested, 0) ?? 0
    const progress = (earnedPoints / WRITING_SYSTEMS_DATA[writingSystem].length) * 4 * 100

    useEffect(() => {
        const container = document.getElementById('box-container')
        if (!container) {
            return
        }
        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect()
            setBox({ width, height, size: Math.min(width, height) })
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
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-stone-100 p-12">
            <div className="flex w-full items-center gap-6">
                <Select
                    value={writingSystem}
                    onValueChange={(selectedWritingSystem: WritingSystem) => {
                        setWritingSystem(selectedWritingSystem)
                        setDeck(shuffleArray(WRITING_SYSTEMS_DATA[selectedWritingSystem]))
                        setIndex(0)
                    }}
                >
                    <SelectTrigger className="w-30 bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hiragana">Hiragana</SelectItem>
                        <SelectItem value="katakana">Katakana</SelectItem>
                    </SelectContent>
                </Select>
                <Progress className="flex-1 [&>div]:bg-[#BE0028]" value={progress} />
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
                    <div id="box-container" className="flex w-full flex-1 items-center justify-center">
                        <div
                            className="flex max-h-full max-w-full items-center justify-center"
                            style={{
                                width: box.width > box.height ? `${box.size}px` : `100%`,
                                height: box.width > box.height ? `100%` : `${box.size}px`,
                                fontSize: `${box.size * 0.6}px`
                            }}
                        >
                            {current.character}
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4 md:w-fit md:flex-row md:gap-6">
                        {options.map((option) => (
                            <Button
                                size="lg"
                                key={option}
                                disabled={!isAnswerCorrect && option !== current.romanji}
                                onClick={() => handleOptionClick(!!userId, option === current.romanji)}
                                variant={!isAnswerCorrect && option !== current.romanji ? 'destructive' : 'outline'}
                                className={cn(
                                    'rounded-3xl border md:h-26 md:px-10 md:text-6xl',
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
