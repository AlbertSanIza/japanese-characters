import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { hiragana } from '@/data/hiragana'
import { cn } from '@/lib/utils'

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

function createShuffledDeck() {
    return shuffleArray([...hiragana])
}

export default function App() {
    const [wasCorrect, setWasCorrect] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [options, setOptions] = useState<string[]>([])
    const [deck, setDeck] = useState(() => createShuffledDeck())

    const currentCharacter = deck[currentIndex]
    const progress = ((currentIndex + 1) / deck.length) * 100

    useEffect(() => {
        setOptions(shuffleArray([currentCharacter.romanji, ...getWrongOptions(currentCharacter.romanji, 3)]))
    }, [currentCharacter])

    const handleOptionClick = (option: string) => {
        if (option === currentCharacter.romanji) {
            nextCharacter()
            return
        }
        setWasCorrect(false)
    }

    const nextCharacter = () => {
        if (currentIndex + 1 >= deck.length) {
            setDeck(createShuffledDeck())
            setCurrentIndex(0)
        } else {
            setCurrentIndex(currentIndex + 1)
        }
        setWasCorrect(true)
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 p-12">
            <Progress className="[&>div]:bg-[#BE0028]" value={progress} />
            <div className="flex flex-1 items-center text-[56vh] leading-[56vh]">{currentCharacter.character}</div>
            <div className="flex w-full flex-col gap-4 md:w-fit md:flex-row md:gap-6">
                {options.map((option) => (
                    <Button
                        size="lg"
                        variant={!wasCorrect && option !== currentCharacter.romanji ? 'destructive' : 'outline'}
                        className={cn(
                            'rounded-3xl md:h-26 md:px-10 md:text-6xl',
                            !wasCorrect && option !== currentCharacter.romanji && 'opacity-10!',
                            !wasCorrect && option === currentCharacter.romanji && 'border-green-600 bg-green-100'
                        )}
                        key={option}
                        onClick={() => handleOptionClick(option)}
                        disabled={!wasCorrect && option !== currentCharacter.romanji}
                    >
                        {option}
                    </Button>
                ))}
            </div>
        </div>
    )
}
