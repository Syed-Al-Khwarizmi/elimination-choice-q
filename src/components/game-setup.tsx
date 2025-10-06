import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play } from "@phosphor-icons/react"

interface GameSetupProps {
  onStartGame: (items: string[]) => void
}

const GAME_ITEMS = [
  "iPhone",
  "Airwrap",
  "Necklace",
  "Makeup kit",
  "Perfume",
  "Purse",
  "Coffee blends",
  "Assorted Tea",
  "Dark Chocolate",
  "Watch",
  "Apple Watch",
  "Earrings",
  "Branded Hoodie",
  "Headphones",
  "Shoes"
]

export function GameSetup({ onStartGame }: GameSetupProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">This or That</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Discover your preference through elimination.
        </p>
      </div>

      <Card className="border-2 hover:border-primary transition-colors">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">Ready to Start?</CardTitle>
          <CardDescription className="text-base">
            Choose between pairs of items until only your top preference remains.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => onStartGame(GAME_ITEMS)}
            size="lg"
            className="gap-3 px-8 py-4 text-lg font-semibold"
          >
            <Play weight="fill" size={24} />
            Begin Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}