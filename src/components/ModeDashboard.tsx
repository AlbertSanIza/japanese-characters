import { Button } from '@/components/ui/button'
import type { LearningMode, WritingSystem } from '@/lib/types'

interface ModeDashboardProps {
    writingSystem: WritingSystem
    onSelectMode: (mode: LearningMode) => void
}

export function ModeDashboard({ writingSystem, onSelectMode }: ModeDashboardProps) {
    const modes = [
        {
            id: 'quiz' as LearningMode,
            icon: '📝',
            title: 'Quiz Mode',
            description: 'Multiple choice questions',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'typing' as LearningMode,
            icon: '⌨️',
            title: 'Typing Mode',
            description: 'Type the romanji',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 'speed' as LearningMode,
            icon: '⚡',
            title: 'Speed Challenge',
            description: 'Beat the clock',
            color: 'from-orange-500 to-red-600'
        },
        {
            id: 'memory' as LearningMode,
            icon: '🃏',
            title: 'Memory Game',
            description: 'Match the pairs',
            color: 'from-purple-500 to-pink-600'
        }
    ]

    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 p-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Choose Your Learning Mode</h2>
                <p className="mt-2 text-gray-600">
                    Learning {writingSystem} - Pick a mode that suits your style
                </p>
            </div>

            <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onSelectMode(mode.id)}
                        className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 text-left transition-all hover:border-gray-300 hover:shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`rounded-xl bg-gradient-to-br ${mode.color} p-4 text-4xl`}>
                                {mode.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold">{mode.title}</h3>
                                <p className="text-gray-600">{mode.description}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium">
                            Start Learning
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
                <p>💡 Try different modes to find what works best for you!</p>
            </div>
        </div>
    )
}
