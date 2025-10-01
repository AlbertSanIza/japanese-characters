import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { hiragana } from '@/data/hiragana'
import { cn } from '@/lib/utils'

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
    const [wasCorrect, setWasCorrect] = useState(true)
    const [options, setOptions] = useState<string[]>([])
    const [currentCharacter, setCurrentCharacter] = useState(getRandomCharacter())

    useEffect(() => {
        const wrongOptions = getWrongOptions(currentCharacter.romanji, 2)
        setOptions(shuffleArray([currentCharacter.romanji, ...wrongOptions]))
    }, [currentCharacter])

    const handleOptionClick = (option: string) => {
        if (option === currentCharacter.romanji) {
            nextCharacter()
        } else {
            setWasCorrect(false)
        }
    }

    const nextCharacter = () => {
        setCurrentCharacter(getRandomCharacter())
        setWasCorrect(true)
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 p-6">
            <div className="flex flex-1 items-center">
                <span className="text-[40vh] leading-[40vh]">{currentCharacter.character}</span>
            </div>
            <div className={cn('text-9xl font-bold opacity-0', !wasCorrect && 'opacity-100')}>{currentCharacter.romanji}</div>
            {wasCorrect ? (
                <div className="flex w-full flex-col gap-4 sm:w-fit sm:flex-row sm:gap-6">
                    {options.map((option) => (
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-3xl sm:h-26 sm:px-12 sm:text-6xl"
                            key={option}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            ) : (
                <Button variant="outline" className="h-26 rounded-3xl px-12 text-6xl" onClick={nextCharacter}>
                    Next
                </Button>
            )}
        </div>
    )
}
