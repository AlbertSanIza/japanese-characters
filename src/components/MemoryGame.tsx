import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn, shuffleArray } from '@/lib/utils'

interface MemoryGameProps {
    writingSystem: WritingSystem
    onBack: () => void
}

type GridSize = 'small' | 'medium' | 'large'
type Card = { id: string; content: string; type: 'character' | 'romanji'; matched: boolean }

const GRID_CONFIGS = {
    small: { pairs: 8, cols: 4 },
    medium: { pairs: 18, cols: 6 },
    large: { pairs: 24, cols: 8 }
}

export function MemoryGame({ writingSystem, onBack }: MemoryGameProps) {
    const { userId } = useAuth()
    const saveScore = useMutation(api.memoryGame.saveScore)
    const [gridSize, setGridSize] = useState<GridSize>('small')
    const leaderboard = useQuery(api.memoryGame.getLeaderboard, { writingSystem, gridSize, limit: 5 })
    const personalBest = useQuery(
        api.memoryGame.getPersonalBest,
        userId ? { writingSystem, gridSize } : 'skip'
    )

    const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup')
    const [cards, setCards] = useState<Card[]>([])
    const [flipped, setFlipped] = useState<string[]>([])
    const [moves, setMoves] = useState(0)
    const [startTime, setStartTime] = useState<number>(0)
    const [endTime, setEndTime] = useState<number>(0)

    const initializeGame = (size: GridSize) => {
        const config = GRID_CONFIGS[size]
        const characters = shuffleArray(WRITING_SYSTEMS_DATA[writingSystem]).slice(0, config.pairs)

        const gameCards: Card[] = []
        characters.forEach((char, idx) => {
            gameCards.push({
                id: `char-${idx}`,
                content: char.character,
                type: 'character',
                matched: false
            })
            gameCards.push({
                id: `romanji-${idx}`,
                content: char.romanji,
                type: 'romanji',
                matched: false
            })
        })

        setCards(shuffleArray(gameCards))
        setFlipped([])
        setMoves(0)
        setStartTime(Date.now())
        setEndTime(0)
        setGameState('playing')
    }

    const handleCardClick = (cardId: string) => {
        if (flipped.length >= 2 || flipped.includes(cardId)) return

        const card = cards.find((c) => c.id === cardId)
        if (card?.matched) return

        const newFlipped = [...flipped, cardId]
        setFlipped(newFlipped)

        if (newFlipped.length === 2) {
            setMoves((m) => m + 1)

            const [firstId, secondId] = newFlipped
            const firstCard = cards.find((c) => c.id === firstId)
            const secondCard = cards.find((c) => c.id === secondId)

            const firstChar = WRITING_SYSTEMS_DATA[writingSystem].find(
                (char) => char.character === firstCard?.content || char.romanji === firstCard?.content
            )
            const secondChar = WRITING_SYSTEMS_DATA[writingSystem].find(
                (char) => char.character === secondCard?.content || char.romanji === secondCard?.content
            )

            const isMatch =
                firstChar &&
                secondChar &&
                firstChar.romanji === secondChar.romanji &&
                firstCard?.type !== secondCard?.type

            setTimeout(() => {
                if (isMatch) {
                    setCards((prevCards) =>
                        prevCards.map((c) =>
                            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
                        )
                    )
                }
                setFlipped([])

                const allMatched = cards.every((c) => c.id === firstId || c.id === secondId || c.matched)
                if (isMatch && allMatched) {
                    handleGameEnd()
                }
            }, 1000)
        }
    }

    const handleGameEnd = async () => {
        const time = Date.now()
        setEndTime(time)
        setGameState('finished')

        const totalTime = Math.floor((time - startTime) / 1000)

        if (userId) {
            await saveScore({
                writingSystem,
                gridSize,
                time: totalTime,
                moves
            })
        }
    }

    const isMatched = cards.every((c) => c.matched)

    useEffect(() => {
        if (gameState === 'playing' && isMatched) {
            handleGameEnd()
        }
    }, [isMatched, gameState])

    const elapsedTime = gameState === 'playing' && startTime > 0
        ? Math.floor((Date.now() - startTime) / 1000)
        : endTime > 0
        ? Math.floor((endTime - startTime) / 1000)
        : 0

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (gameState === 'setup') {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-stone-100 p-6">
                <Button variant="outline" onClick={onBack} className="absolute left-6 top-6">
                    ← Back
                </Button>

                <h1 className="text-4xl font-bold">🃏 Memory Game</h1>
                <p className="max-w-md text-center text-lg text-gray-600">
                    Match characters with their romanji! Flip two cards at a time to find pairs.
                </p>

                <div className="w-full max-w-md space-y-6">
                    <h3 className="text-center font-bold">Choose Grid Size:</h3>

                    <div className="space-y-3">
                        {(['small', 'medium', 'large'] as GridSize[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => setGridSize(size)}
                                className={cn(
                                    'w-full rounded-xl border-2 p-4 transition-colors',
                                    gridSize === size
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-left font-bold capitalize">{size}</div>
                                        <div className="text-left text-sm text-gray-600">
                                            {GRID_CONFIGS[size].pairs} pairs
                                        </div>
                                    </div>
                                    {personalBest && personalBest.gridSize === size && (
                                        <div className="text-right text-sm">
                                            <div className="text-gray-600">Best:</div>
                                            <div className="font-bold">{formatTime(personalBest.time)}</div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <Button size="lg" onClick={() => initializeGame(gridSize)} className="w-full">
                        Start Game
                    </Button>
                </div>
            </div>
        )
    }

    if (gameState === 'finished') {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-stone-100 p-6">
                <h1 className="text-4xl font-bold">🎉 Game Complete!</h1>

                <div className="w-full max-w-md space-y-4 rounded-xl border-2 border-gray-200 bg-white p-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Time</div>
                            <div className="text-3xl font-bold text-blue-600">{formatTime(elapsedTime)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Moves</div>
                            <div className="text-3xl font-bold text-purple-600">{moves}</div>
                        </div>
                    </div>

                    {personalBest && elapsedTime < personalBest.time && (
                        <div className="rounded-lg bg-yellow-100 p-3 text-center font-bold text-yellow-800">
                            🎖️ New Personal Best! -{personalBest.time - elapsedTime}s
                        </div>
                    )}
                </div>

                {leaderboard && leaderboard.length > 0 && (
                    <div className="w-full max-w-md rounded-xl border-2 border-gray-200 bg-white p-6">
                        <h3 className="mb-4 text-center font-bold">🏆 Top Times</h3>
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
                                        <span>{formatTime(entry.time)}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{entry.moves} moves</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setGameState('setup')}>
                        Change Size
                    </Button>
                    <Button onClick={() => initializeGame(gridSize)} className="px-8">
                        Play Again
                    </Button>
                </div>
            </div>
        )
    }

    const config = GRID_CONFIGS[gridSize]

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-stone-100 p-6 md:p-12">
            <div className="flex w-full items-center justify-between">
                <div className="text-xl font-bold">⏱️ {formatTime(elapsedTime)}</div>
                <h2 className="text-2xl font-bold">🃏 Memory Game</h2>
                <div className="text-xl font-bold">Moves: {moves}</div>
            </div>

            <div
                className="grid gap-2 md:gap-4"
                style={{
                    gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                    maxWidth: `${config.cols * 100}px`
                }}
            >
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || card.matched
                    return (
                        <button
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            disabled={isFlipped || flipped.length >= 2}
                            className={cn(
                                'aspect-square rounded-lg border-2 transition-all',
                                isFlipped
                                    ? 'border-blue-600 bg-white'
                                    : 'border-gray-300 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                                card.matched && 'opacity-50'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-full items-center justify-center text-2xl font-bold transition-opacity md:text-4xl',
                                    isFlipped ? 'opacity-100' : 'opacity-0'
                                )}
                            >
                                {card.content}
                            </div>
                        </button>
                    )
                })}
            </div>

            <Button variant="outline" onClick={() => setGameState('setup')}>
                Exit Game
            </Button>
        </div>
    )
}
