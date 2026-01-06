import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn, getAnswerOptions, shuffleArray } from '@/lib/utils'

interface SpeedChallengeProps {
    writingSystem: WritingSystem
    onBack: () => void
}

export function SpeedChallenge({ writingSystem, onBack }: SpeedChallengeProps) {
    const { userId } = useAuth()
    const saveScore = useMutation(api.speedChallenge.saveScore)
    const leaderboard = useQuery(api.speedChallenge.getLeaderboard, { writingSystem, limit: 5 })
    const personalBest = useQuery(api.speedChallenge.getPersonalBest, userId ? { writingSystem } : 'skip')
    
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready')
    const [timeLeft, setTimeLeft] = useState(60)
    const [deck, setDeck] = useState(() => shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
    const [index, setIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [combo, setCombo] = useState(0)
    const [maxCombo, setMaxCombo] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [incorrect, setIncorrect] = useState(0)
    const [box, setBox] = useState({ size: 0, isWide: false })

    const current = deck[index]
    const options = useMemo(() => getAnswerOptions(current.romanji, 3, writingSystem), [current.romanji, writingSystem])

    useEffect(() => {
        const container = document.getElementById('speed-box-container')
        if (!container) return

        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect()
            setBox({ size: Math.min(width, height), isWide: width > height })
        })
        resizeObserver.observe(container)
        return () => resizeObserver.disconnect()
    }, [])

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
            return () => clearTimeout(timer)
        } else if (gameState === 'playing' && timeLeft === 0) {
            handleGameEnd()
        }
    }, [gameState, timeLeft])

    const handleGameEnd = async () => {
        setGameState('finished')
        const total = correct + incorrect
        const accuracy = total > 0 ? (correct / total) * 100 : 0
        
        if (userId) {
            await saveScore({
                writingSystem,
                score,
                time: 60,
                accuracy,
                maxCombo
            })
        }
    }

    const handleStart = () => {
        setGameState('playing')
        setTimeLeft(60)
        setDeck(shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
        setIndex(0)
        setScore(0)
        setCombo(0)
        setMaxCombo(0)
        setCorrect(0)
        setIncorrect(0)
    }

    const handleAnswer = (selectedOption: string) => {
        const isCorrect = selectedOption === current.romanji

        if (isCorrect) {
            const comboMultiplier = Math.floor(combo / 5) + 1
            const points = 1 + comboMultiplier
            setScore((s) => s + points)
            setCombo((c) => c + 1)
            setMaxCombo((m) => Math.max(m, combo + 1))
            setCorrect((c) => c + 1)
            
            setIndex((prevIndex) => {
                if (prevIndex + 1 >= deck.length) {
                    setDeck(shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]))
                    return 0
                }
                return prevIndex + 1
            })
        } else {
            setCombo(0)
            setIncorrect((i) => i + 1)
            setTimeLeft((t) => Math.max(0, t - 5))
        }
    }

    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0
    const comboMultiplier = Math.floor(combo / 5) + 1

    if (gameState === 'ready') {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-stone-100 p-6">
                <Button variant="outline" onClick={onBack} className="absolute left-6 top-6">
                    ← Back
                </Button>
                
                <h1 className="text-4xl font-bold">⚡ Speed Challenge</h1>
                <p className="max-w-md text-center text-lg text-gray-600">
                    Answer as many characters as you can in 60 seconds! Build combos for bonus points.
                </p>

                <div className="w-full max-w-md space-y-4 rounded-xl border-2 border-gray-200 bg-white p-6">
                    <h3 className="text-center font-bold">Rules:</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>• Correct answer: +1 point (+ combo bonus)</li>
                        <li>• Wrong answer: -5 seconds & lose combo</li>
                        <li>• Every 5 combo: +1 bonus point per answer</li>
                    </ul>
                </div>

                {personalBest && (
                    <div className="text-center">
                        <div className="text-sm text-gray-600">Your Personal Best</div>
                        <div className="text-3xl font-bold text-blue-600">{personalBest.score} points</div>
                    </div>
                )}

                <Button size="lg" onClick={handleStart} className="h-16 px-12 text-2xl">
                    Start Challenge
                </Button>
            </div>
        )
    }

    if (gameState === 'finished') {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-stone-100 p-6">
                <h1 className="text-4xl font-bold">🎉 Challenge Complete!</h1>
                
                <div className="w-full max-w-md space-y-4 rounded-xl border-2 border-gray-200 bg-white p-8">
                    <div className="text-center">
                        <div className="text-lg text-gray-600">Final Score</div>
                        <div className="text-5xl font-bold text-blue-600">{score}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Correct</div>
                            <div className="text-2xl font-bold text-green-600">{correct}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Incorrect</div>
                            <div className="text-2xl font-bold text-red-600">{incorrect}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Max Combo</div>
                            <div className="text-2xl font-bold text-purple-600">{maxCombo}x</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Accuracy</div>
                            <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                        </div>
                    </div>

                    {personalBest && score > personalBest.score && (
                        <div className="rounded-lg bg-yellow-100 p-3 text-center font-bold text-yellow-800">
                            🎖️ New Personal Best! +{score - personalBest.score} points
                        </div>
                    )}
                </div>

                {leaderboard && leaderboard.length > 0 && (
                    <div className="w-full max-w-md rounded-xl border-2 border-gray-200 bg-white p-6">
                        <h3 className="mb-4 text-center font-bold">🏆 Top Scores</h3>
                        <div className="space-y-2">
                            {leaderboard.map((entry, idx) => (
                                <div
                                    key={entry._id}
                                    className={cn(
                                        'flex items-center justify-between rounded-lg p-2',
                                        entry.userId === userId && 'bg-blue-50'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold">{idx + 1}.</span>
                                        <span>{entry.score} pts</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{entry.accuracy.toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button variant="outline" onClick={onBack}>
                        Back to Modes
                    </Button>
                    <Button onClick={handleStart} className="px-8">
                        Play Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-stone-100 p-6 md:p-12">
            <div className="flex w-full items-center justify-between">
                <div className="text-2xl font-bold">Score: {score}</div>
                <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-red-600">{timeLeft}s</div>
                    {combo >= 5 && (
                        <div className="animate-pulse text-xl font-bold text-orange-600">
                            🔥 x{comboMultiplier}
                        </div>
                    )}
                </div>
                <div className="text-2xl font-bold">Combo: {combo}</div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
            </div>

            {combo >= 5 && (
                <div className="text-lg font-bold text-orange-600">
                    💫 COMBO BONUS! +{comboMultiplier} point{comboMultiplier > 1 ? 's' : ''} per answer
                </div>
            )}

            <div id="speed-box-container" className="flex w-full flex-1 items-center justify-center">
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
                        onClick={() => handleAnswer(option)}
                        variant="outline"
                        className="h-16 rounded-3xl border text-3xl font-bold md:h-26 md:px-10 md:text-6xl md:font-normal"
                    >
                        {option}
                    </Button>
                ))}
            </div>
        </div>
    )
}
