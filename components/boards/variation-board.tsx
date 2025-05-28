"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Move, Orientation, Variation } from "@/lib/types/database.types";
import { ChevronLeft, ChevronRight, FlipVertical2 } from "lucide-react";
import MoveList from "./move-list";
import { Chess } from "chess.js";
import ChessBoard from "./chess-board";

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
  const [currentPly, setCurrentPly] = useState(-1);
  const boardMoves = useMemo(() => {
    return [
      ...moves.map((move) => ({
        ply: move.ply,
        fen: move.fen,
      })),
    ];
  }, [moves]);

  const canPlayPreviousMove = currentPly >= 0;
  const canPlayNextMove = currentPly < boardMoves.length - 1;

  const playPreviousMove = () => {
    if (currentPly > 0) {
      setGame(new Chess(boardMoves[currentPly - 1].fen));
      setCurrentPly(currentPly - 1);
    } else {
      setGame(new Chess(variation.start_fen ?? undefined));
      setCurrentPly(-1);
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
        <div className="sm:col-span-2">
          <ChessBoard
            game={game}
            boardOrientation={boardOrientation}
            arePiecesDraggable={false}
          />
          <div className="flex flex-row justify-end gap-4 mt-2">
            <div className="flex gap-2">
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
            </div>
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
        <div className="sm:col-span-1">
          <MoveList
            moves={moves}
            currentPly={currentPly}
            onMoveClick={handleMoveClick}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
