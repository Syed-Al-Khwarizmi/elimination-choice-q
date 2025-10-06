# This or That Elimination Game

A simple preference discovery app that helps users find their top choice through tournament-style elimination.

**Experience Qualities**:
1. **Decisive** - Clear binary choices that feel meaningful and help users commit to preferences
2. **Progressive** - Visual sense of advancement toward a final result with satisfying momentum  
3. **Intuitive** - Effortless interaction that feels like a natural conversation about preferences

**Complexity Level**: Micro Tool (single-purpose)
- Focused solely on the elimination game mechanic with minimal setup and maximum clarity

## Essential Features

### Tournament Bracket System
- **Functionality**: Present pairs of items for head-to-head comparison until one winner remains
- **Purpose**: Simplifies complex multi-option decisions into digestible binary choices
- **Trigger**: User clicks "Start Game" or selects a predefined category
- **Progression**: Setup items → Random pairing → Choice selection → Next pairing → Winner reveal
- **Success criteria**: User reaches final winner and feels confident about the result

### Visual Progress Tracking  
- **Functionality**: Shows current round, remaining items, and elimination progress
- **Purpose**: Maintains engagement and provides sense of advancement
- **Trigger**: Automatically updates after each choice
- **Progression**: Full bracket display → Round counter → Remaining items indicator → Completion celebration
- **Success criteria**: User always knows where they are in the process

### Customizable Item Lists
- **Functionality**: Predefined categories (tech, food, lifestyle) or custom item entry
- **Purpose**: Makes the game relevant to different decision contexts
- **Trigger**: Category selection or "Add Custom Items" button
- **Progression**: Category browse → Selection → Item preview → Game start
- **Success criteria**: Easy setup leads to personally meaningful comparisons

## Edge Case Handling

- **Single Item**: Display "Already your winner!" message with celebration
- **Two Items**: Skip directly to final comparison 
- **Empty List**: Prompt user to add items before starting
- **Odd Numbers**: Handle bracket seeding with bye rounds automatically
- **Browser Refresh**: Restore current game state using persistence

## Design Direction

The interface should feel like a friendly game show - playful yet focused, with clear visual hierarchy that makes choices feel significant without being overwhelming. Minimal interface with bold, confident styling that emphasizes the current decision.

## Color Selection

Complementary (opposite colors) - Using warm orange primary against cool blue accents to create energetic tension that mirrors the decision-making process.

- **Primary Color**: Warm Orange (oklch(0.7 0.15 45)) - Confidence and energy for choice buttons
- **Secondary Colors**: Cool Blue (oklch(0.6 0.15 225)) - Trust and calm for progress indicators  
- **Accent Color**: Bright Green (oklch(0.75 0.2 135)) - Success and winner celebration
- **Foreground/Background Pairings**:
  - Background (White oklch(1 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 15.8:1 ✓
  - Primary Orange (oklch(0.7 0.15 45)): White text (oklch(1 0 0)) - Ratio 4.7:1 ✓  
  - Secondary Blue (oklch(0.6 0.15 225)): White text (oklch(1 0 0)) - Ratio 6.2:1 ✓
  - Accent Green (oklch(0.75 0.2 135)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typography should feel confident and modern, using a clean sans-serif that makes choices feel important and definitive.

- **Typographic Hierarchy**:
  - H1 (Game Title): Inter Bold/32px/tight letter spacing
  - H2 (Item Names): Inter SemiBold/24px/normal letter spacing  
  - Body (Progress Text): Inter Regular/16px/relaxed line height
  - Button Text: Inter Medium/18px/wide letter spacing for emphasis

## Animations

Smooth transitions that feel responsive and celebratory - quick enough to maintain pace but meaningful enough to acknowledge each decision. Balance between functional feedback and moments of delight during eliminations and final winner reveal.

- **Purposeful Meaning**: Cards slide smoothly between rounds, eliminated items fade gracefully, winner appears with satisfying scale animation
- **Hierarchy of Movement**: Choice selection (immediate), round transitions (smooth), winner celebration (delightful)

## Component Selection

- **Components**: Card components for item display, Button for choices, Progress for bracket status, Dialog for winner celebration, Badge for item categories
- **Customizations**: Large choice cards with hover states, animated progress indicators, confetti-style winner reveal
- **States**: Buttons show hover/active feedback, cards highlight on hover, disabled states during transitions
- **Icon Selection**: Trophy for winners, ArrowRight for progression, X for elimination, Play for game start
- **Spacing**: Generous padding (p-8) for choice cards, consistent gap-6 for layouts, margin-4 for inline elements
- **Mobile**: Stacked card layout on small screens, thumb-friendly button sizes (min 44px), single-column progression display