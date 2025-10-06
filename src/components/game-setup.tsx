import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Play } from "@phosphor-icons/react"

interface GameSetupProps {
  onStartGame: (items: string[]) => void
}

const PRESET_CATEGORIES = [
  {
    name: "Tech Gadgets",
    items: ["iPhone", "MacBook", "AirPods", "iPad", "Apple Watch", "Nintendo Switch", "Tesla", "Airwrap"]
  },
  {
    name: "Foods",
    items: ["Pizza", "Burger", "Sushi", "Tacos", "Ice Cream", "Dark Chocolate", "Coffee", "Pasta"]
  },
  {
    name: "Travel Destinations", 
    items: ["Paris", "Tokyo", "New York", "London", "Sydney", "Dubai", "Iceland", "Maldives"]
  }
]

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [customItems, setCustomItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState("")

  const addCustomItem = () => {
    if (newItem.trim() && !customItems.includes(newItem.trim())) {
      setCustomItems([...customItems, newItem.trim()])
      setNewItem("")
    }
  }

  const removeCustomItem = (index: number) => {
    setCustomItems(customItems.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCustomItem()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">This or That</h1>
        <p className="text-lg text-muted-foreground">
          Discover your true preference through elimination
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Choose a Category</h2>
        {PRESET_CATEGORIES.map((category) => (
          <Card key={category.name} className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.items.length} items</CardDescription>
                </div>
                <Button 
                  onClick={() => onStartGame(category.items)}
                  size="sm"
                  className="gap-2"
                >
                  <Play weight="fill" />
                  Start
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {category.items.slice(0, 6).map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
                {category.items.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{category.items.length - 6} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Items</CardTitle>
          <CardDescription>
            Add your own items to compare (minimum 2 required)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add an item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addCustomItem} size="icon" variant="outline">
              <Plus />
            </Button>
          </div>
          
          {customItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {customItems.map((item, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {item}
                    <button
                      onClick={() => removeCustomItem(index)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <Button 
                onClick={() => onStartGame(customItems)}
                disabled={customItems.length < 2}
                className="w-full gap-2"
              >
                <Play weight="fill" />
                Start Game ({customItems.length} items)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}