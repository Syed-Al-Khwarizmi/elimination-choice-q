import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Repeat } from "@phosphor-icons/react"

interface WinnerCelebrationProps {
  winner: string
  onPlayAgain: () => void
}

export function WinnerCelebration({ winner, onPlayAgain }: WinnerCelebrationProps) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      >
        <div className="mb-6">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="inline-block"
          >
            <Trophy size={64} className="text-accent mx-auto mb-4" weight="fill" />
          </motion.div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            We have a winner!
          </h1>
          <p className="text-lg text-muted-foreground">
            After careful elimination, your preference is clear
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card className="p-12 border-2 border-accent bg-accent/5">
          <motion.h2 
            className="text-5xl font-bold text-accent mb-4"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {winner}
          </motion.h2>
          <p className="text-xl text-muted-foreground">
            Your ultimate choice
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="space-y-4"
      >
        <p className="text-muted-foreground">
          Ready to discover another preference?
        </p>
        <Button onClick={onPlayAgain} size="lg" className="gap-2">
          <Repeat />
          Play Again
        </Button>
      </motion.div>

      {/* Floating celebration particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full"
            initial={{ 
              x: "50vw", 
              y: "50vh",
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3,
              delay: 1 + (i * 0.1),
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}