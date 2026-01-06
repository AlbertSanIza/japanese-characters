import { useAuth } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn, shuffleArray } from '@/lib/utils'

interface TypingModeProps {
    writingSystem: WritingSystem
    onBack: () => void
}

export function TypingMode({ writingSystem, onBack }: TypingModeProps) {
    const { userId } = useAuth()
    const answer = useMutation(api.progress.answer)
    const [deck, setDeck] = useState(() => shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
    const [index, setIndex] = useState(0)
    const [input, setInput] = useState('')
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
    const [stats, setStats] = useState({ correct: 0, incorrect: 0, totalTime: 0, startTime: Date.now() })
    const [box, setBox] = useState({ size: 0, isWide: false })

    const current = deck[index]

    useEffect(() => {
        setDeck(shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
        setIndex(0)
        setStats({ correct: 0, incorrect: 0, totalTime: 0, startTime: Date.now() })
    }, [writingSystem])

    useEffect(() => {
        const container = document.getElementById('typing-box-container')
        if (!container) return

        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect()
            setBox({ size: Math.min(width, height), isWide: width > height })
        })
        resizeObserver.observe(container)
        return () => resizeObserver.disconnect()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const userAnswer = input.trim().toLowerCase()
        const correctAnswer = current.romanji.toLowerCase()
        const isCorrect = userAnswer === correctAnswer

        if (userId) {
            answer({ writingSystem, romanji: current.romanji, isCorrect })
        }

        setFeedback(isCorrect ? 'correct' : 'incorrect')
        setStats((prev) => ({
            ...prev,
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (isCorrect ? 0 : 1)
        }))

        if (isCorrect) {
            setTimeout(() => {
                setInput('')
                setFeedback(null)
                setIndex((prevIndex) => {
                    if (prevIndex + 1 >= deck.length) {
                        setDeck(shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
                        return 0
                    }
                    return prevIndex + 1
                })
            }, 1000)
        } else {
            setTimeout(() => {
                setFeedback(null)
                setInput('')
            }, 1500)
        }
    }

    const accuracy = stats.correct + stats.incorrect > 0
        ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
        : 0

    const avgTime = stats.correct > 0
        ? ((Date.now() - stats.startTime) / stats.correct / 1000).toFixed(1)
        : '0.0'

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-stone-100 p-6 md:p-12">
            <div className="flex w-full items-center justify-between">
                <Button variant="outline" onClick={onBack}>
                    ← Back to Modes
                </Button>
                <h2 className="text-2xl font-bold">⌨️ Typing Mode</h2>
                <div className="w-32" />
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-center gap-8">
                <div id="typing-box-container" className="flex w-full max-w-2xl flex-1 items-center justify-center">
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

                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type the romanji..."
                            disabled={feedback !== null}
                            autoFocus
                            className={cn(
                                'h-16 rounded-xl border-2 bg-white px-6 text-center text-3xl font-bold outline-none transition-colors',
                                feedback === 'correct' && 'border-green-600 bg-green-50',
                                feedback === 'incorrect' && 'border-red-600 bg-red-50',
                                feedback === null && 'border-gray-300 focus:border-blue-500'
                            )}
                        />
                        
                        {feedback === 'incorrect' && (
                            <div className="text-center text-lg text-red-600">
                                Correct answer: <span className="font-bold">{current.romanji}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            disabled={!input.trim() || feedback !== null}
                            className="h-14 text-xl"
                        >
                            Submit (or press Enter)
                        </Button>
                    </div>
                </form>
            </div>

            <div className="grid w-full max-w-2xl grid-cols-2 gap-4 rounded-xl border-2 border-gray-200 bg-white p-6 md:grid-cols-4">
                <div className="text-center">
                    <div className="text-sm text-gray-600">Correct</div>
                    <div className="text-2xl font-bold text-green-600">✅ {stats.correct}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-600">Incorrect</div>
                    <div className="text-2xl font-bold text-red-600">❌ {stats.incorrect}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-600">Accuracy</div>
                    <div className="text-2xl font-bold text-blue-600">🎯 {accuracy}%</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-600">Avg Time</div>
                    <div className="text-2xl font-bold text-purple-600">⏱️ {avgTime}s</div>
                </div>
            </div>
        </div>
    )
}
