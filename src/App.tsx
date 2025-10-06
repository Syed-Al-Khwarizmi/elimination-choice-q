import { useState } from "react"
import { GameSetup } from "./components/game-setup"
import { EliminationGame } from "./components/elimination-game"

function App() {
  const [gameItems, setGameItems] = useState<string[] | null>(null)

  const startGame = (items: string[]) => {
    setGameItems(items)
  }

  const resetToSetup = () => {
    setGameItems(null)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {gameItems ? (
          <EliminationGame 
            initialItems={gameItems}
            onRestart={resetToSetup}
          />
        ) : (
          <GameSetup onStartGame={startGame} />
        )}
      </div>
    </div>
  )
}

export default App