import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface ChoiceCardProps {
  item: string
  onClick: () => void
  isSelected?: boolean
}

export function ChoiceCard({ item, onClick, isSelected }: ChoiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`
          p-8 cursor-pointer transition-all duration-200 border-2
          hover:border-primary hover:shadow-lg
          ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}
        `}
        onClick={onClick}
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {item}
          </h2>
          <p className="text-sm text-muted-foreground">
            Tap to choose
          </p>
        </div>
      </Card>
    </motion.div>
  )
}