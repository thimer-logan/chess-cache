import { Move } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface MoveListProps {
  moves: Move[];
  currentPly: number;
  onMoveClick?: (ply: number) => void;
  className?: string;
}

export default function MoveList({
  moves,
  currentPly,
  onMoveClick,
  className,
}: MoveListProps) {
  // Group moves into pairs (white and black moves)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      whiteMove: moves[i],
      blackMove: moves[i + 1],
    });
  }

  return (
    <Card className={cn("p-4 max-h-[400px] overflow-y-auto", className)}>
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-sm items-center">
        {movePairs.map(({ moveNumber, whiteMove, blackMove }) => (
          <div key={moveNumber} className="contents">
            <span className="text-muted-foreground">{moveNumber}.</span>
            <Button
              onClick={() => onMoveClick?.(whiteMove.ply)}
              variant="ghost"
              className={cn(
                currentPly === whiteMove.ply && "bg-accent hover:bg-accent/80"
              )}
            >
              {whiteMove.san}
            </Button>
            {blackMove && (
              <Button
                onClick={() => onMoveClick?.(blackMove.ply)}
                variant="ghost"
                className={cn(
                  currentPly === blackMove.ply && "bg-accent hover:bg-accent/80"
                )}
              >
                {blackMove.san}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
