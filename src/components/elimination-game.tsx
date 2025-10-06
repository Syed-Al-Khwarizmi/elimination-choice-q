import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChoiceCard } from "./choice-card"
import { WinnerCelebration } from "./winner-celebration"
import { ArrowLeft } from "@phosphor-icons/react"
import { useKV } from "@github/spark/hooks"

interface EliminationGameProps {
  initialItems: string[]
  onRestart: () => void
}

interface GameState {
  items: string[]
  eliminated: string[]
  currentPair: string[]
  round: number
  totalRounds: number
  isComplete: boolean
  winner: string | null
  itemScores: Record<string, number>
}

export function EliminationGame({ initialItems, onRestart }: EliminationGameProps) {
  const [gameState, setGameState] = useKV<GameState>("elimination-game-state", {
    items: initialItems,
    eliminated: [],
    currentPair: [],
    round: 1,
    totalRounds: 0,
    isComplete: false,
    winner: null,
    itemScores: {}
  })

  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

  // Initialize or restore game
  useEffect(() => {
    if (!gameState || gameState.items.length === 0 || 
        !gameState.items.every(item => initialItems.includes(item))) {
      // Initialize new game
      const shuffled = [...initialItems].sort(() => Math.random() - 0.5)
      const totalRounds = Math.ceil(Math.log2(shuffled.length))
      const initialScores: Record<string, number> = {}
      shuffled.forEach(item => initialScores[item] = 0)
      
      setGameState({
        items: shuffled,
        eliminated: [],
        currentPair: shuffled.slice(0, 2),
        round: 1,
        totalRounds,
        isComplete: false,
        winner: null,
        itemScores: initialScores
      })
    }
  }, [initialItems, gameState, setGameState])

  // Handle choice selection
  const makeChoice = (chosen: string) => {
    if (!gameState) return
    
    setSelectedChoice(chosen)
    
    setTimeout(() => {
      if (!gameState) return
      
      const rejected = gameState.currentPair.find(item => item !== chosen)!
      const newEliminated = [...gameState.eliminated, rejected]
      const remaining = gameState.items.filter(item => item !== rejected)
      
      // Update scores - chosen item gets a point
      const updatedScores = { ...gameState.itemScores }
      updatedScores[chosen] = (updatedScores[chosen] || 0) + 1

      if (remaining.length === 1) {
        // Game complete
        setGameState({
          ...gameState,
          isComplete: true,
          winner: remaining[0],
          items: remaining,
          eliminated: newEliminated,
          currentPair: [],
          itemScores: updatedScores
        })
        setShowCelebration(true)
      } else {
        // Continue game - find next pair
        const availableItems = remaining.filter(item => !gameState.currentPair.includes(item))
        
        let nextPair: string[]
        if (availableItems.length > 0) {
          // Pair chosen item with an unused item from this round
          // Prioritize items with higher scores (survivors from previous rounds)
          const sortedAvailable = availableItems.sort((a, b) => 
            (updatedScores[b] || 0) - (updatedScores[a] || 0)
          )
          nextPair = [chosen, sortedAvailable[0]]
        } else {
          // All items have been compared this round, start new round
          // Sort remaining items by score (higher scoring items appear in later rounds)
          const sortedRemaining = remaining.sort((a, b) => 
            (updatedScores[b] || 0) - (updatedScores[a] || 0)
          )
          nextPair = sortedRemaining.slice(0, 2)
        }

        const newRound = availableItems.length === 0 ? gameState.round + 1 : gameState.round

        setGameState({
          ...gameState,
          items: remaining,
          eliminated: newEliminated,
          currentPair: nextPair,
          round: newRound,
          itemScores: updatedScores
        })
      }
      
      setSelectedChoice(null)
    }, 800)
  }

  const resetGame = () => {
    setGameState({
      items: [],
      eliminated: [],
      currentPair: [],
      round: 1,
      totalRounds: 0,
      isComplete: false,
      winner: null,
      itemScores: {}
    })
    setShowCelebration(false)
    onRestart()
  }

  if (!gameState) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p>Loading game...</p>
      </div>
    )
  }

  const progress = gameState.eliminated.length > 0 
    ? (gameState.eliminated.length / (initialItems.length - 1)) * 100
    : 0

  if (showCelebration && gameState.winner) {
    return (
      <WinnerCelebration 
        winner={gameState.winner}
        onPlayAgain={resetGame}
      />
    )
  }

  if (gameState.currentPair.length < 2) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p>Setting up your game...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={resetGame} className="gap-2">
          <ArrowLeft />
          Back to Setup
        </Button>
        
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">
            Round {gameState.round} of {gameState.totalRounds}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {gameState.items.length} items remaining
          </p>
        </div>
        
        <div className="w-24"> {/* Spacer for layout balance */}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Question */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Which do you prefer?</h1>
        <p className="text-muted-foreground">Choose one to continue</p>
      </div>

      {/* Choice Cards */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={gameState.currentPair.join("-")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {gameState.currentPair.map((item) => (
            <motion.div
              key={item}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ChoiceCard
                item={item}
                onClick={() => makeChoice(item)}
                isSelected={selectedChoice === item}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Versus indicator */}
      <div className="text-center">
        <Badge variant="outline" className="text-lg py-2 px-4">
          VS
        </Badge>
      </div>
    </div>
  )
}