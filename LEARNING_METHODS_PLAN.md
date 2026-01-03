# Fun Ways to Learn Japanese Characters - Implementation Plan

## Executive Summary

This document outlines 8 innovative learning methods to enhance the Japanese Characters learning application. Each method offers a unique approach to memorizing Hiragana and Katakana characters, catering to different learning styles and preferences.

## Current Application State

### Existing Features
- ✅ Multiple-choice quiz (4 options per character)
- ✅ Progress tracking with visual heatmap
- ✅ Cloud save with Clerk authentication
- ✅ Support for both Hiragana and Katakana
- ✅ Randomized character order
- ✅ Responsive design (mobile & desktop)

### Technical Stack
- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI components
- **Backend**: Convex (serverless)
- **Authentication**: Clerk
- **State Management**: React hooks + Convex real-time queries

---

## Proposed Learning Methods

### 🎯 1. Typing Mode (High Priority - Quick Win)

**Description**: Users type the romanji directly instead of selecting from multiple choices.

**Benefits**:
- Reinforces active recall
- More challenging than multiple-choice
- Natural typing practice
- Better for intermediate learners

**Technical Implementation**:

**UI Changes**:
```tsx
// Replace the 4-button grid with:
- Text input field for romanji entry
- Submit button or Enter key to check answer
- Visual feedback (green/red border)
- Show correct answer on mistake
```

**Database Schema**: No changes needed (reuse existing progress tracking)

**New Components**:
- `TypingInput.tsx` - Input field with validation
- Modify `App.tsx` to support mode switching

**Complexity**: 🟢 Low (2-3 hours)

**User Flow**:
1. User sees character (e.g., あ)
2. User types romanji in input field
3. Press Enter or click Submit
4. Instant feedback (correct/incorrect)
5. Auto-advance on correct answer

---

### 🃏 2. Memory/Matching Game (High Priority)

**Description**: Classic memory card game - flip cards to match characters with their romanji.

**Benefits**:
- Gamified learning experience
- Works visual memory
- Fun for all skill levels
- Encourages pattern recognition

**Technical Implementation**:

**UI Changes**:
```tsx
// New game board layout:
- Grid of face-down cards (4x4 or 6x6)
- Cards contain either character or romanji
- Flip animation on click
- Match/mismatch feedback
- Timer and move counter
```

**Database Schema**:
```typescript
// Add new table:
memoryGameScores: {
  userId: string
  writingSystem: 'hiragana' | 'katakana'
  gridSize: 'small' | 'medium' | 'large'
  time: number // seconds
  moves: number
  date: number
}
```

**New Components**:
- `MemoryGame.tsx` - Main game component
- `Card.tsx` - Flippable card component
- `GameStats.tsx` - Timer and moves display
- `Leaderboard.tsx` - Best scores display

**Complexity**: 🟡 Medium (8-12 hours)

**Game Variants**:
- Small (4x4 = 8 pairs)
- Medium (6x6 = 18 pairs)
- Large (8x6 = 24 pairs) - all characters

---

### ✍️ 3. Stroke Order Animation (Medium Priority)

**Description**: Show animated stroke order for each character and let users practice drawing.

**Benefits**:
- Learn proper writing technique
- Visual and kinesthetic learning
- Authentic Japanese learning method
- Memorable through muscle memory

**Technical Implementation**:

**Data Required**:
- SVG stroke order data (need external dataset)
- Possible sources: KanjiVG (adapted), Wikipedia Commons
- Alternative: Integrate API like Google Handwriting

**UI Changes**:
```tsx
// New stroke order view:
- Animated SVG showing stroke sequence
- Interactive canvas for user drawing
- Stroke-by-stroke validation
- Playback speed control
- Practice mode vs. test mode
```

**Database Schema**:
```typescript
// Add stroke order data:
strokeOrderData: {
  character: string
  writingSystem: 'hiragana' | 'katakana'
  strokes: Array<{
    path: string // SVG path data
    order: number
  }>
}

// Track drawing practice:
drawingProgress: {
  userId: string
  romanji: string
  writingSystem: 'hiragana' | 'katakana'
  attempts: number
  accuracy: number // 0-100
}
```

**New Components**:
- `StrokeOrderViewer.tsx` - Animation display
- `DrawingCanvas.tsx` - Interactive drawing area
- `StrokeValidator.tsx` - Validation logic

**External Dependencies**:
- Canvas drawing library (e.g., `react-sketch-canvas`)
- Stroke recognition algorithm
- SVG animation library

**Complexity**: 🔴 High (20-30 hours)

**Implementation Phases**:
1. Phase 1: Display static stroke order images/animations
2. Phase 2: Add interactive drawing canvas
3. Phase 3: Implement stroke validation

---

### 📚 4. Spaced Repetition System (High Priority for Retention)

**Description**: Intelligent review system that shows characters when they're about to be forgotten (like Anki).

**Benefits**:
- Scientifically proven learning method
- Maximizes long-term retention
- Efficient use of study time
- Personalized to each user

**Technical Implementation**:

**Algorithm**: Modified SM-2 (SuperMemo 2)
```
Easiness Factor (EF) based on user performance:
- Again (0): EF decreases, card shown soon
- Hard (1): EF slightly decreases
- Good (2): EF maintains, normal interval
- Easy (3): EF increases, longer interval

Next review interval calculation:
- First review: 1 day
- Second review: 6 days
- Subsequent: previous interval × EF
```

**Database Schema**:
```typescript
srsCards: {
  userId: string
  romanji: string
  writingSystem: 'hiragana' | 'katakana'
  easeFactor: number // 1.3 - 2.5 (default 2.5)
  interval: number // days
  nextReview: number // timestamp
  reviewCount: number
  lapseCount: number // times forgotten
}
```

**UI Changes**:
```tsx
// New SRS interface:
- "Due cards" counter (red badge)
- Review queue system
- 4 difficulty buttons (Again, Hard, Good, Easy)
- Daily/weekly statistics
- Forecast calendar showing upcoming reviews
```

**New Components**:
- `SRSReview.tsx` - Review session interface
- `SRSDashboard.tsx` - Statistics and calendar
- `SRSSettings.tsx` - Customize intervals and limits

**Complexity**: 🟡 Medium-High (12-16 hours)

---

### 💡 5. Story/Mnemonic Mode (Medium Priority)

**Description**: Associate each character with memorable stories or visual mnemonics.

**Benefits**:
- Makes abstract characters memorable
- Leverages narrative memory
- User-generated content increases engagement
- Community learning aspect

**Technical Implementation**:

**Database Schema**:
```typescript
mnemonics: {
  romanji: string
  writingSystem: 'hiragana' | 'katakana'
  userId: string // creator
  story: string
  imageUrl?: string
  likes: number
  createdAt: number
}

userMnemonicPreferences: {
  userId: string
  romanji: string
  writingSystem: 'hiragana' | 'katakana'
  selectedMnemonicId: Id<'mnemonics'>
  customMnemonic?: string
}
```

**UI Changes**:
```tsx
// Mnemonic view:
- Display story alongside character
- Toggle between quiz and mnemonic mode
- User submission form
- Community mnemonics gallery
- Upvote/downvote system
- Personal notes section
```

**New Components**:
- `MnemonicCard.tsx` - Display mnemonic story
- `MnemonicForm.tsx` - Submit new mnemonic
- `MnemonicGallery.tsx` - Browse community submissions

**Seed Data**: Pre-populate with popular mnemonics:
```typescript
// Examples:
あ (a) - "Looks like an 'A-frame' house"
か (ka) - "Looks like a 'KA-rate' kick"
さ (sa) - "Like 'SA-murai sword slashing down"
```

**Complexity**: 🟡 Medium (10-14 hours)

---

### ⚡ 6. Speed Challenge Mode (Quick Win)

**Description**: Timed quiz with combo system and leaderboards.

**Benefits**:
- Adds competitive element
- Tests rapid recall
- Fun for reviewing known characters
- Social motivation via leaderboards

**Technical Implementation**:

**Database Schema**:
```typescript
speedChallenges: {
  userId: string
  writingSystem: 'hiragana' | 'katakana'
  score: number // correct answers
  time: number // seconds
  accuracy: number // percentage
  maxCombo: number
  date: number
}
```

**UI Changes**:
```tsx
// Speed mode interface:
- Large countdown timer (30/60/90 seconds)
- Current combo counter (streak)
- Score display
- Progress bar for time remaining
- Leaderboard overlay
- Challenge friends feature
```

**Game Mechanics**:
- Time limits: 30s, 60s, 90s, or endless
- Combo multiplier (2x, 3x, 4x after consecutive correct answers)
- Penalty for wrong answers (lose combo, -5 seconds)
- Sound effects for streaks

**New Components**:
- `SpeedChallenge.tsx` - Main game component
- `Timer.tsx` - Countdown display
- `ComboIndicator.tsx` - Streak display
- `SpeedLeaderboard.tsx` - Rankings

**Complexity**: 🟢 Low-Medium (4-6 hours)

---

### 🔊 7. Audio Pronunciation Mode (Medium Priority)

**Description**: Listen to character pronunciation and practice audio-based recognition.

**Benefits**:
- Develops listening comprehension
- Proper pronunciation learning
- Accessibility for visual impairments
- Multi-sensory learning

**Technical Implementation**:

**Audio Source Options**:
1. **Web Speech API** (Free, built-in)
   ```typescript
   const utterance = new SpeechSynthesisUtterance('あ');
   utterance.lang = 'ja-JP';
   speechSynthesis.speak(utterance);
   ```
   - Pros: Free, no API needed
   - Cons: Quality varies by browser/device

2. **Google Cloud Text-to-Speech** (Paid)
   - Pros: High quality, consistent
   - Cons: API costs, requires setup

3. **Pre-recorded Audio Files**
   - Pros: Best quality control
   - Cons: Need to source/record 92 files

**Database Schema**:
```typescript
audioProgress: {
  userId: string
  romanji: string
  writingSystem: 'hiragana' | 'katakana'
  listenCount: number
  correctIdentifications: number
}
```

**UI Changes**:
```tsx
// Audio mode interface:
- Large speaker icon (play button)
- "Reveal answer" button
- Audio waveform visualization (optional)
- Volume control
- Speed control (slow/normal/fast)
```

**Game Modes**:
1. **Listen & Select**: Hear romanji, select character
2. **Listen & Type**: Hear romanji, type it out
3. **Pronunciation Practice**: Record and compare

**New Components**:
- `AudioPlayer.tsx` - Playback controls
- `AudioQuiz.tsx` - Listening quiz
- `AudioRecorder.tsx` - Record user pronunciation

**Complexity**: 🟡 Medium (8-12 hours with Web Speech API)

---

### 📖 8. Context Learning Mode (Medium-High Priority)

**Description**: Show characters in context with example words and sentences.

**Benefits**:
- Practical vocabulary building
- Contextual understanding
- Smooth transition to reading
- More meaningful learning

**Technical Implementation**:

**Database Schema**:
```typescript
vocabulary: {
  word: string // Japanese word in kana
  romanji: string
  english: string
  characters: string[] // ['あ', 'り', 'が', 'と', 'う']
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string // 'greetings', 'food', 'numbers', etc.
}

sentences: {
  japanese: string
  romanji: string
  english: string
  targetCharacters: string[] // highlighted characters
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}
```

**UI Changes**:
```tsx
// Context view:
- Main character display
- 3-5 example words using the character
- 1-2 simple sentences
- Audio pronunciation for words
- English translations
- Character highlighting in context
```

**Seed Data Examples**:
```typescript
// For あ (a):
words: [
  { word: 'あい', romanji: 'ai', english: 'love' },
  { word: 'あさ', romanji: 'asa', english: 'morning' },
  { word: 'ありがとう', romanji: 'arigatou', english: 'thank you' }
]

sentences: [
  {
    japanese: 'あさごはんをたべます',
    romanji: 'asagohan wo tabemasu',
    english: 'I eat breakfast'
  }
]
```

**New Components**:
- `ContextViewer.tsx` - Display context
- `WordList.tsx` - Example words
- `SentenceDisplay.tsx` - Example sentences
- `VocabularyQuiz.tsx` - Quiz on words

**Complexity**: 🟡 Medium-High (14-18 hours including content creation)

---

## Implementation Priority Matrix

### Quick Wins (Low Effort, High Impact)
1. ⚡ **Speed Challenge Mode** - 4-6 hours
2. 🎯 **Typing Mode** - 2-3 hours

### High Impact (Worth the Investment)
3. 📚 **Spaced Repetition System** - 12-16 hours
4. 🃏 **Memory/Matching Game** - 8-12 hours

### Medium Priority (Good Long-term Value)
5. 💡 **Story/Mnemonic Mode** - 10-14 hours
6. 🔊 **Audio Pronunciation Mode** - 8-12 hours
7. 📖 **Context Learning Mode** - 14-18 hours

### Long-term Goal (High Effort)
8. ✍️ **Stroke Order Animation** - 20-30 hours

---

## Recommended Implementation Roadmap

### Phase 1: Core Enhancements (2-3 weeks)
**Goal**: Add variety to learning with minimal infrastructure changes

**Week 1**:
- ✅ Typing Mode (2-3 hours)
- ✅ Speed Challenge Mode (4-6 hours)
- ✅ Basic leaderboard system

**Week 2**:
- ✅ Memory/Matching Game (8-12 hours)
- ✅ Game statistics tracking

**Week 3**:
- ✅ Polish UI/UX
- ✅ Bug fixes and testing
- ✅ Deploy Phase 1

**Deliverables**:
- 3 new game modes
- Enhanced engagement metrics
- User testing feedback

---

### Phase 2: Advanced Learning (3-4 weeks)
**Goal**: Implement scientifically-backed learning methods

**Week 4-5**:
- ✅ Spaced Repetition System (12-16 hours)
- ✅ SRS algorithm implementation
- ✅ Review scheduling system

**Week 6**:
- ✅ Audio Pronunciation Mode (8-12 hours)
- ✅ Web Speech API integration

**Week 7**:
- ✅ Testing and optimization
- ✅ Deploy Phase 2

**Deliverables**:
- SRS review system
- Audio learning capabilities
- Improved retention metrics

---

### Phase 3: Content & Context (3-4 weeks)
**Goal**: Expand from character memorization to practical usage

**Week 8-9**:
- ✅ Story/Mnemonic Mode (10-14 hours)
- ✅ Community content system
- ✅ Pre-populate with quality mnemonics

**Week 10-11**:
- ✅ Context Learning Mode (14-18 hours)
- ✅ Vocabulary database
- ✅ Sentence examples

**Week 12**:
- ✅ Content creation and curation
- ✅ Deploy Phase 3

**Deliverables**:
- User-generated mnemonics
- Vocabulary integration
- Contextual learning path

---

### Phase 4: Premium Features (Future)
**Goal**: Advanced features for dedicated learners

- ✅ Stroke Order Animation (20-30 hours)
- ✅ Drawing recognition
- ✅ Advanced analytics dashboard
- ✅ Social features (friends, challenges)
- ✅ Mobile app (React Native)

---

## Technical Considerations

### Database Migration Strategy
```typescript
// Convex migration approach:
1. Add new tables alongside existing ones
2. No breaking changes to existing progress table
3. Gradual rollout of new features
4. Backward compatibility maintained
```

### UI/UX Patterns
```typescript
// Mode Selection Interface:
- Main dashboard with mode cards
- Each card shows:
  - Mode icon
  - Description
  - Best score/stats
  - "Start" button
  - Lock icon for unimplemented modes
```

### Performance Considerations
- Lazy load mode components
- Cache character data in memory
- Optimize re-renders with React.memo
- Use Convex's built-in caching
- Implement virtual scrolling for large lists

### Testing Strategy
- Unit tests for game logic
- Integration tests for Convex functions
- E2E tests for critical user flows
- Manual testing on multiple devices
- A/B testing for new features

---

## Metrics & Success Criteria

### Key Performance Indicators (KPIs)

**Engagement Metrics**:
- Daily Active Users (DAU)
- Session duration
- Retention rate (D1, D7, D30)
- Feature usage distribution

**Learning Metrics**:
- Characters mastered per user
- Accuracy rate over time
- Review completion rate (SRS)
- Time to proficiency (all characters)

**User Satisfaction**:
- Net Promoter Score (NPS)
- User feedback/ratings
- Feature requests
- Bug reports

### Success Targets (6 months post-launch)
- ✅ 30% increase in DAU
- ✅ 50% increase in session duration
- ✅ 40% improvement in D30 retention
- ✅ 80% of users try at least 2 modes
- ✅ 90% character mastery rate improvement

---

## Resource Requirements

### Development Time
- **Phase 1**: 40-60 hours
- **Phase 2**: 60-80 hours
- **Phase 3**: 80-100 hours
- **Phase 4**: 100-150 hours
- **Total**: 280-390 hours (~2-3 months full-time)

### External Services
- Convex (existing)
- Clerk authentication (existing)
- GitHub Pages hosting (existing)
- Optional: Google TTS API (~$4-16/month)
- Optional: CDN for audio files

### Content Creation
- Mnemonic stories: 92 characters × 2-3 variants
- Audio files: 92 files (if not using TTS)
- Vocabulary words: ~200-300 beginner words
- Example sentences: ~100-150 sentences

---

## Risk Assessment

### Technical Risks
- **Drawing recognition accuracy**: Stroke order validation is complex
  - Mitigation: Start with display-only, add validation later
- **Browser audio compatibility**: TTS quality varies
  - Mitigation: Provide fallback to text-only mode
- **Database scaling**: New tables increase data size
  - Mitigation: Convex handles scaling, monitor usage

### User Experience Risks
- **Feature overload**: Too many options confuse users
  - Mitigation: Progressive disclosure, onboarding tour
- **Performance degradation**: More features = slower app
  - Mitigation: Code splitting, lazy loading
- **Learning curve**: New modes need explanation
  - Mitigation: Tooltips, tutorials, examples

### Business Risks
- **Development time underestimation**: Complex features take longer
  - Mitigation: Phased rollout, MVP approach
- **Low adoption**: Users prefer existing mode
  - Mitigation: A/B testing, user research first
- **Maintenance burden**: More code to maintain
  - Mitigation: Good documentation, automated tests

---

## Competitive Analysis

### Similar Apps
| App | Strengths | Weaknesses | Differentiators |
|-----|-----------|------------|-----------------|
| Duolingo | Gamification, SRS | Not character-focused | Our: Pure kana focus |
| Anki | SRS algorithm | Steep learning curve | Our: Simpler UX |
| Drops | Visual learning | Limited free content | Our: Fully free |
| Wanikani | Mnemonics, context | English-only, paid | Our: Multilingual potential |

### Our Unique Value Proposition
- ✅ **Free and open-source**
- ✅ **Multiple learning modes in one app**
- ✅ **Beautiful, modern UI**
- ✅ **Focus on fundamentals (kana mastery)**
- ✅ **Cloud sync across devices**
- ✅ **No ads, no paywalls**

---

## Community Engagement Ideas

### User-Generated Content
- Submit mnemonics with moderation
- Share high scores on social media
- Create and share custom quiz decks
- Contribute translations

### Gamification Elements
- Achievement badges system
- Skill level titles (Beginner → Master)
- Daily/weekly/monthly challenges
- Community leaderboards
- Streak tracking

### Social Features (Future)
- Friend system
- Challenge friends to speed runs
- Study groups/rooms
- Share progress on social media
- Discord integration

---

## Internationalization (i18n) Considerations

### Current Language: English
### Potential Expansions:
- Spanish (large Japanese learner base)
- Portuguese (Brazil - strong interest)
- French
- German
- Chinese (Traditional/Simplified)
- Korean

### Implementation:
```typescript
// Use i18next or react-i18next
- UI text translations
- Instruction translations
- Keep romanji as universal standard
- Character names in multiple languages
```

---

## Accessibility (a11y) Improvements

### WCAG 2.1 Compliance
- ✅ Keyboard navigation for all features
- ✅ Screen reader support
- ✅ High contrast mode
- ✅ Font size adjustment
- ✅ Color blind friendly design
- ✅ Audio descriptions
- ✅ Closed captions for audio mode

### Inclusive Design
- ✅ Support for motor impairments (larger click targets)
- ✅ Alternative input methods (voice)
- ✅ Reduced motion mode
- ✅ Dyslexia-friendly fonts option

---

## Monetization Options (Optional)

### Freemium Model
**Free Features**:
- All character learning modes
- Basic progress tracking
- Community mnemonics
- Cloud save

**Premium Features** ($2.99/month):
- Advanced analytics dashboard
- Unlimited SRS cards
- Custom study plans
- Priority support
- Ad-free experience
- Early access to new features
- Stroke order practice (Phase 4)

### Donation Model
- Patreon/Ko-fi for supporters
- Sponsor tiers with recognition
- Keep core features free

### Partnership Opportunities
- Japanese learning platforms
- Educational institutions
- Language learning communities

---

## Conclusion

This comprehensive plan provides multiple pathways to enhance the Japanese Characters learning application. The modular approach allows for incremental improvements while maintaining the core simplicity that makes the current app successful.

### Next Steps

1. **Review & Prioritize**: Discuss with stakeholders which modes align with project goals
2. **User Research**: Survey current users about desired features
3. **Prototype**: Create mockups for top 2-3 modes
4. **MVP Development**: Start with Phase 1 quick wins
5. **Iterate**: Gather feedback and adjust roadmap

### Recommendation

**Start with Phase 1** to validate the multi-mode approach:
1. Implement **Typing Mode** (2-3 hours) - minimal risk, high value
2. Add **Speed Challenge** (4-6 hours) - fun, engaging, competitive
3. Launch **Memory Game** (8-12 hours) - different learning style

This gives users 3 distinct learning methods within 2-3 weeks, provides valuable usage data, and sets the foundation for more advanced features in Phases 2-4.

---

## Appendix

### A. Technical Architecture Diagram
```
┌─────────────────────────────────────────────┐
│           User Interface (React)            │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Quiz    │ │  Typing  │ │  Memory  │   │
│  │  Mode    │ │  Mode    │ │  Game    │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Speed   │ │   SRS    │ │  Audio   │   │
│  │Challenge │ │  Review  │ │  Mode    │   │
│  └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────┤
│           State Management (Hooks)          │
├─────────────────────────────────────────────┤
│         Convex Client (Real-time)           │
├─────────────────────────────────────────────┤
│              Clerk Auth (JWT)               │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│         Convex Backend (Serverless)         │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │         Database Tables               │  │
│  │  • progress                           │  │
│  │  • srsCards                           │  │
│  │  • memoryGameScores                   │  │
│  │  • speedChallenges                    │  │
│  │  • mnemonics                          │  │
│  │  • vocabulary                         │  │
│  │  • audioProgress                      │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │            API Functions              │  │
│  │  • Queries (read data)                │  │
│  │  • Mutations (write data)             │  │
│  │  • Actions (external APIs)            │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### B. User Flow Diagrams

**Mode Selection Flow**:
```
Landing Page → Sign In (Optional) → Mode Dashboard → Select Mode → Play → Results → Repeat
                                    ↓
                                Progress View
```

**SRS Review Flow**:
```
Check Due Cards → Start Review Session → Show Card → Rate Difficulty → Update Schedule → Next Card
                                                                         ↓
                                                                    Session Complete
```

### C. Database Schema Visualization

```sql
-- Existing
progress(userId, writingSystem, romanji, tested)

-- Phase 1
memoryGameScores(userId, writingSystem, gridSize, time, moves, date)
speedChallenges(userId, writingSystem, score, time, accuracy, maxCombo, date)

-- Phase 2
srsCards(userId, romanji, writingSystem, easeFactor, interval, nextReview, reviewCount, lapseCount)
audioProgress(userId, romanji, writingSystem, listenCount, correctIdentifications)

-- Phase 3
mnemonics(romanji, writingSystem, userId, story, imageUrl, likes, createdAt)
userMnemonicPreferences(userId, romanji, writingSystem, selectedMnemonicId, customMnemonic)
vocabulary(word, romanji, english, characters[], difficulty, category)
sentences(japanese, romanji, english, targetCharacters[], difficulty)

-- Phase 4
strokeOrderData(character, writingSystem, strokes[])
drawingProgress(userId, romanji, writingSystem, attempts, accuracy)
```

### D. Component Hierarchy

```
App
├── Header
│   ├── ModeSelector
│   ├── ProgressBar
│   └── UserButton
├── ModeDashboard
│   ├── ModeCard (Quiz)
│   ├── ModeCard (Typing)
│   ├── ModeCard (Memory)
│   ├── ModeCard (Speed)
│   ├── ModeCard (SRS)
│   ├── ModeCard (Audio)
│   └── ModeCard (Context)
├── QuizMode (existing)
│   ├── CharacterDisplay
│   ├── OptionButtons
│   └── CharacterChart
├── TypingMode
│   ├── CharacterDisplay
│   ├── TypingInput
│   └── SubmitButton
├── MemoryGame
│   ├── GameHeader (Timer, Moves)
│   ├── CardGrid
│   │   └── Card (x8, x18, or x24)
│   └── GameStats
├── SpeedChallenge
│   ├── Timer
│   ├── ComboIndicator
│   ├── QuestionDisplay
│   └── Leaderboard
├── SRSReview
│   ├── CardDisplay
│   ├── DifficultyButtons
│   ├── SRSDashboard
│   └── Calendar
├── AudioMode
│   ├── AudioPlayer
│   ├── PlaybackControls
│   └── ResponseInput
└── ContextMode
    ├── CharacterDisplay
    ├── WordList
    └── SentenceDisplay
```

### E. API Endpoints Summary

**Queries** (Read):
```typescript
getProgress(writingSystem) → progress[]
getSRSCards(writingSystem) → srsCard[]
getMemoryScores(writingSystem, gridSize) → score[]
getSpeedLeaderboard(writingSystem) → challenge[]
getMnemonics(romanji, writingSystem) → mnemonic[]
getVocabulary(romanji, writingSystem) → vocabulary[]
```

**Mutations** (Write):
```typescript
answer(writingSystem, romanji, isCorrect) → void
updateSRSCard(cardId, rating) → void
saveMemoryScore(writingSystem, gridSize, time, moves) → void
saveSpeedScore(writingSystem, score, time, accuracy, maxCombo) → void
submitMnemonic(romanji, writingSystem, story, imageUrl) → mnemonicId
voteMnemonic(mnemonicId, vote) → void
reset(writingSystem) → void
```

**Actions** (External):
```typescript
generateAudio(text) → audioUrl
validateStroke(strokeData) → accuracy
```

---

## Questions for Discussion

Before implementation, please consider:

1. **Priority**: Which 2-3 modes should we implement first?
2. **Timeline**: What's the realistic timeline for Phase 1?
3. **Resources**: Solo developer or team effort?
4. **Content**: Who will create mnemonics, vocabulary, sentences?
5. **Testing**: What's the testing strategy and user base?
6. **Monetization**: Keep fully free or explore premium options?
7. **Scope**: Start small and iterate, or big bang release?

---

## Contact & Feedback

This is a living document. Please provide feedback on:
- Feasibility of proposed features
- Priority adjustments
- Additional ideas not covered
- Technical concerns or constraints
- User research insights

Last Updated: 2026-01-03
Version: 1.0
Author: AI Planning Assistant
