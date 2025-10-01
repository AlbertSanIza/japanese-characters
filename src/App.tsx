import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { hiragana } from '@/data'

function getRandomCharacter() {
    return hiragana[Math.floor(Math.random() * hiragana.length)]
}

function getWrongOptions(correctRomanji: string, count: number): string[] {
    const wrongOptions: string[] = []
    const allRomanji = hiragana.map((h) => h.romanji).filter((r) => r !== correctRomanji)

    while (wrongOptions.length < count) {
        const randomOption = allRomanji[Math.floor(Math.random() * allRomanji.length)]
        if (!wrongOptions.includes(randomOption)) {
            wrongOptions.push(randomOption)
        }
    }

    return wrongOptions
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export default function App() {
    const [currentCharacter, setCurrentCharacter] = useState(getRandomCharacter())
    const [options, setOptions] = useState<string[]>([])
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)

    useEffect(() => {
        // Generate 3 options: 1 correct and 2 wrong
        const wrongOptions = getWrongOptions(currentCharacter.romanji, 2)
        const allOptions = shuffleArray([currentCharacter.romanji, ...wrongOptions])
        setOptions(allOptions)
    }, [currentCharacter])

    const handleOptionClick = (option: string) => {
        if (selectedAnswer) return // Prevent clicking after selection

        setSelectedAnswer(option)

        if (option === currentCharacter.romanji) {
            nextCharacter()
        } else {
            // Wrong answer - show correct answer
            setShowCorrectAnswer(true)
        }
    }

    const nextCharacter = () => {
        setCurrentCharacter(getRandomCharacter())
        setSelectedAnswer(null)
        setShowCorrectAnswer(false)
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-12 p-12">
            <div className="flex flex-1 flex-col gap-6 text-center">
                <div className="flex-1 bg-amber-100 text-[30vh] leading-[32vh]">{currentCharacter.character}</div>
                <div className="text-6xl font-semibold">{currentCharacter.romanji}</div>
            </div>
            {!showCorrectAnswer ? (
                <div className="flex gap-6">
                    {options.map((option) => (
                        <Button size="xl" variant="outline" key={option} disabled={selectedAnswer !== null} onClick={() => handleOptionClick(option)}>
                            {option}
                        </Button>
                    ))}
                </div>
            ) : (
                <Button size="xl" variant="ghost" onClick={nextCharacter}>
                    Next
                </Button>
            )}
        </div>
    )
}
