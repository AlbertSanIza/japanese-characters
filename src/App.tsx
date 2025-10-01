import { useEffect, useState } from 'react'

const hiraganaData = [
    { character: 'あ', romanji: 'a' },
    { character: 'い', romanji: 'i' },
    { character: 'う', romanji: 'u' },
    { character: 'え', romanji: 'e' },
    { character: 'お', romanji: 'o' },
    { character: 'か', romanji: 'ka' },
    { character: 'き', romanji: 'ki' },
    { character: 'く', romanji: 'ku' },
    { character: 'け', romanji: 'ke' },
    { character: 'こ', romanji: 'ko' },
    { character: 'さ', romanji: 'sa' },
    { character: 'し', romanji: 'shi' },
    { character: 'す', romanji: 'su' },
    { character: 'せ', romanji: 'se' },
    { character: 'そ', romanji: 'so' },
    { character: 'た', romanji: 'ta' },
    { character: 'ち', romanji: 'chi' },
    { character: 'つ', romanji: 'tsu' },
    { character: 'て', romanji: 'te' },
    { character: 'と', romanji: 'to' },
    { character: 'な', romanji: 'na' },
    { character: 'に', romanji: 'ni' },
    { character: 'ぬ', romanji: 'nu' },
    { character: 'ね', romanji: 'ne' },
    { character: 'の', romanji: 'no' },
    { character: 'は', romanji: 'ha' },
    { character: 'ひ', romanji: 'hi' },
    { character: 'ふ', romanji: 'fu' },
    { character: 'へ', romanji: 'he' },
    { character: 'ほ', romanji: 'ho' },
    { character: 'ま', romanji: 'ma' },
    { character: 'み', romanji: 'mi' },
    { character: 'む', romanji: 'mu' },
    { character: 'め', romanji: 'me' },
    { character: 'も', romanji: 'mo' },
    { character: 'や', romanji: 'ya' },
    { character: 'ゆ', romanji: 'yu' },
    { character: 'よ', romanji: 'yo' },
    { character: 'ら', romanji: 'ra' },
    { character: 'り', romanji: 'ri' },
    { character: 'る', romanji: 'ru' },
    { character: 'れ', romanji: 're' },
    { character: 'ろ', romanji: 'ro' },
    { character: 'わ', romanji: 'wa' },
    { character: 'を', romanji: 'wo' },
    { character: 'ん', romanji: 'n' }
]

function getRandomCharacter() {
    return hiraganaData[Math.floor(Math.random() * hiraganaData.length)]
}

function getWrongOptions(correctRomanji: string, count: number): string[] {
    const wrongOptions: string[] = []
    const allRomanji = hiraganaData.map((h) => h.romanji).filter((r) => r !== correctRomanji)

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
            // Correct answer - move to next character after a brief delay
            setTimeout(() => {
                nextCharacter()
            }, 500)
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

    const getButtonClass = (option: string) => {
        if (!selectedAnswer) {
            return 'bg-blue-500 hover:bg-blue-600 text-white'
        }

        if (option === currentCharacter.romanji) {
            return 'bg-green-500 text-white'
        }

        return 'bg-red-500 text-white'
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <div className="flex flex-col items-center justify-center gap-12 p-8">
                {/* Character Display */}
                <div className="text-center">
                    <div className="mb-4 text-9xl font-bold text-gray-800">{currentCharacter.character}</div>
                    {showCorrectAnswer && <div className="animate-fade-in text-3xl font-semibold text-green-600">{currentCharacter.romanji}</div>}
                </div>

                {/* Options */}
                {!showCorrectAnswer ? (
                    <div className="flex gap-4">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                disabled={selectedAnswer !== null}
                                className={`${getButtonClass(option)} min-w-32 transform rounded-lg px-8 py-4 text-2xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <button
                        onClick={nextCharacter}
                        className="transform rounded-lg bg-blue-500 px-12 py-4 text-2xl font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-600"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}
