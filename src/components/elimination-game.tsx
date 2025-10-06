import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChoiceCard } from "./choice-card"
import { WinnerCelebration } from "./winner-celebration"
import { ArrowLeft } from "@phosphor-icons/react"
import { useSounds } from "@/hooks/use-sounds"

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
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const { playSelectionSound, playEliminationSound } = useSounds()

  // Create initial game state
  const createInitialGameState = useCallback((): GameState => {
    const shuffled = [...initialItems].sort(() => Math.random() - 0.5)
    const totalRounds = Math.ceil(Math.log2(shuffled.length))
    const initialScores: Record<string, number> = {}
    shuffled.forEach(item => initialScores[item] = 0)
    
    return {
      items: shuffled,
      eliminated: [],
      currentPair: shuffled.slice(0, 2),
      round: 1,
      totalRounds,
      isComplete: false,
      winner: null,
      itemScores: initialScores
    }
  }, [initialItems])

  // Initialize game state on mount
  useEffect(() => {
    if (!gameState) {
      setGameState(createInitialGameState())
    }
  }, [gameState, createInitialGameState])

  // Handle choice selection
  const makeChoice = (chosen: string) => {
    if (!gameState) return
    
    setSelectedChoice(chosen)
    playSelectionSound()
    
    setTimeout(() => {
      playEliminationSound()
      
      setGameState(currentState => {
        if (!currentState || !currentState.currentPair || currentState.currentPair.length < 2) {
          return currentState
        }
        
        const rejected = currentState.currentPair.find(item => item !== chosen)!
        const newEliminated = [...currentState.eliminated, rejected]
        const remaining = currentState.items.filter(item => item !== rejected)
        
        // Update scores - chosen item gets a point
        const updatedScores = { ...currentState.itemScores }
        updatedScores[chosen] = (updatedScores[chosen] || 0) + 1

        if (remaining.length === 1) {
          // Game complete
          const newState = {
            ...currentState,
            isComplete: true,
            winner: remaining[0],
            items: remaining,
            eliminated: newEliminated,
            currentPair: [],
            itemScores: updatedScores
          }
          setShowCelebration(true)
          return newState
        } else {
          // Continue game - find next pair
          const availableItems = remaining.filter(item => !currentState.currentPair.includes(item))
          
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

          const newRound = availableItems.length === 0 ? currentState.round + 1 : currentState.round

          return {
            ...currentState,
            items: remaining,
            eliminated: newEliminated,
            currentPair: nextPair,
            round: newRound,
            itemScores: updatedScores
          }
        }
      })
      
      setSelectedChoice(null)
    }, 800)
  }

  const resetGame = () => {
    setGameState(null)
    setShowCelebration(false)
    onRestart()
  }

  if (!gameState || !gameState.items || gameState.items.length === 0) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p>Setting up your game...</p>
      </div>
    )
  }

  const progress = gameState && gameState.eliminated && gameState.eliminated.length > 0 
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

  if (!gameState.currentPair || gameState.currentPair.length < 2) {
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
            {gameState.items ? gameState.items.length : 0} items remaining
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

      {/* Choice Cards with VS in between */}
      {gameState.currentPair && gameState.currentPair.length >= 2 && (
        <AnimatePresence mode="wait">
          <motion.div 
            key={gameState.currentPair.join("-")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* First Option */}
            <motion.div
              key={gameState.currentPair[0]}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 w-full"
            >
              <ChoiceCard
                item={gameState.currentPair[0]}
                onClick={() => makeChoice(gameState.currentPair[0])}
                isSelected={selectedChoice === gameState.currentPair[0]}
              />
            </motion.div>
            
            {/* VS Badge in the middle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex-shrink-0"
            >
              <Badge variant="outline" className="text-xl py-3 px-6 font-bold bg-background shadow-lg">
                VS
              </Badge>
            </motion.div>
            
            {/* Second Option */}
            <motion.div
              key={gameState.currentPair[1]}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 w-full"
            >
              <ChoiceCard
                item={gameState.currentPair[1]}
                onClick={() => makeChoice(gameState.currentPair[1])}
                isSelected={selectedChoice === gameState.currentPair[1]}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}