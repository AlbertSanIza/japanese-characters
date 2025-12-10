import { WRITING_SYSTEMS_DATA } from '@/data'
import type { WritingSystem } from '@/lib/types'
import { cn } from '@/lib/utils'

const GOJUON_ORDER = [
    ['a', 'i', 'u', 'e', 'o'],
    ['ka', 'ki', 'ku', 'ke', 'ko'],
    ['sa', 'shi', 'su', 'se', 'so'],
    ['ta', 'chi', 'tsu', 'te', 'to'],
    ['na', 'ni', 'nu', 'ne', 'no'],
    ['ha', 'hi', 'fu', 'he', 'ho'],
    ['ma', 'mi', 'mu', 'me', 'mo'],
    ['ya', '', 'yu', '', 'yo'],
    ['ra', 'ri', 'ru', 're', 'ro'],
    ['wa', '', '', '', 'wo'],
    ['n', '', '', '', '']
]

export function CharacterChart({ writingSystem }: { writingSystem: WritingSystem }) {
    const data = WRITING_SYSTEMS_DATA[writingSystem]
    const charMap = new Map(data.map((item) => [item.romanji, item.character]))

    return (
        <div className="h-full w-full max-w-100 overflow-auto rounded-lg border border-slate-300 bg-white p-6 shadow-sm">
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                {GOJUON_ORDER.map((row, rowIndex) =>
                    row.map((romanji, colIndex) => {
                        const character = charMap.get(romanji)
                        const isEmpty = !romanji

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={cn(
                                    isEmpty && 'invisible',
                                    !isEmpty &&
                                        'flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-linear-to-br p-3 transition-all duration-200 hover:shadow-md',
                                    !isEmpty &&
                                        (writingSystem === 'hiragana'
                                            ? 'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
                                            : 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100')
                                )}
                            >
                                {!isEmpty && (
                                    <>
                                        <div
                                            className={cn(
                                                'text-2xl leading-none font-bold',
                                                writingSystem === 'hiragana' ? 'text-purple-900' : 'text-blue-900'
                                            )}
                                        >
                                            {character}
                                        </div>
                                        <div className="mt-1 text-xs font-medium text-slate-600">{romanji}</div>
                                    </>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
