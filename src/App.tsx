import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import { useState } from 'react'

import { MemoryGame } from '@/components/MemoryGame'
import { ModeDashboard } from '@/components/ModeDashboard'
import { QuizMode } from '@/components/QuizMode'
import { SpeedChallenge } from '@/components/SpeedChallenge'
import { TypingMode } from '@/components/TypingMode'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { LearningMode, WritingSystem } from '@/lib/types'

export default function App() {
    const [writingSystem, setWritingSystem] = useState<WritingSystem>('hiragana')
    const [currentMode, setCurrentMode] = useState<LearningMode | null>(null)

    const handleBackToDashboard = () => {
        setCurrentMode(null)
    }

    if (currentMode === 'quiz') {
        return <QuizMode writingSystem={writingSystem} onBack={handleBackToDashboard} />
    }

    if (currentMode === 'typing') {
        return <TypingMode writingSystem={writingSystem} onBack={handleBackToDashboard} />
    }

    if (currentMode === 'speed') {
        return <SpeedChallenge writingSystem={writingSystem} onBack={handleBackToDashboard} />
    }

    if (currentMode === 'memory') {
        return <MemoryGame writingSystem={writingSystem} onBack={handleBackToDashboard} />
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-stone-100 p-6 md:p-12">
            <div className="flex w-full items-center gap-6">
                <Select
                    value={writingSystem}
                    onValueChange={(selectedWritingSystem: WritingSystem) => {
                        setWritingSystem(selectedWritingSystem)
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
                <div className="flex-1" />
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
            
            <ModeDashboard writingSystem={writingSystem} onSelectMode={setCurrentMode} />
        </div>
    )
}
