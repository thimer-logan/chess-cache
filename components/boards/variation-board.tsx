"use client";

import { useState, useMemo } from "react";
import { Chessboard, ChessboardDnDProvider } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Move, Orientation, Variation } from "@/lib/types/database.types";
import { ChevronLeft, ChevronRight, FlipVertical2 } from "lucide-react";
import MoveList from "./move-list";
import { Chess } from "chess.js";

interface VariationBoardProps {
  moves: Move[];
  variation: Variation;
}

export default function VariationBoard({
  moves,
  variation,
}: VariationBoardProps) {
  const [game, setGame] = useState(new Chess(variation.start_fen ?? undefined));
  const [boardOrientation, setBoardOrientation] = useState<Orientation>(
    variation.orientation
  );
  const [currentPly, setCurrentPly] = useState(0);
  const boardMoves = useMemo(() => {
    return [
      {
        ply: 0,
        fen: variation.start_fen ?? undefined,
      },
      ...moves.map((move) => ({
        ply: move.ply,
        fen: move.fen,
      })),
    ];
  }, [moves, variation.start_fen]);

  const canPlayPreviousMove = currentPly > 0;
  const canPlayNextMove = currentPly < boardMoves.length - 1;

  const playPreviousMove = () => {
    if (currentPly > 0) {
      setGame(new Chess(boardMoves[currentPly - 1].fen));
      setCurrentPly(currentPly - 1);
    }
  };

  const playNextMove = () => {
    if (currentPly < boardMoves.length - 1) {
      setGame(new Chess(boardMoves[currentPly + 1].fen));
      setCurrentPly(currentPly + 1);
    }
  };

  const handleMoveClick = (ply: number) => {
    if (ply >= 0 && ply < boardMoves.length) {
      setGame(new Chess(boardMoves[ply].fen));
      setCurrentPly(ply);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8">
        <div className="w-full max-w-[600px]">
          <ChessboardDnDProvider>
            <Chessboard
              id="VariationBoard"
              position={game.fen()}
              boardWidth={600}
              boardOrientation={boardOrientation}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            />
          </ChessboardDnDProvider>
        </div>
        <MoveList
          moves={moves}
          currentPly={currentPly}
          onMoveClick={handleMoveClick}
          className="w-[300px]"
        />
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={playPreviousMove}
          disabled={!canPlayPreviousMove}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={playNextMove}
          disabled={!canPlayNextMove}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setBoardOrientation(
              boardOrientation === "white" ? "black" : "white"
            );
          }}
        >
          <FlipVertical2 />
          Flip board
        </Button>
      </div>
    </div>
  );
}
