"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Orientation, VariationWithLines } from "@/lib/types/database.types";
import { ChevronLeft, ChevronRight, FlipVertical2 } from "lucide-react";
import { Chess } from "chess.js";
import { MoveChoice } from "@/lib/types/utils";
import {
  buildMoveGraph,
  createGraphNavigator,
  groupNextMoveEdges,
} from "@/lib/helpers";
import ChessBoard from "./chess-board";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface ExploreVariationsBoardProps {
  variations: VariationWithLines[];
}

export default function ExploreVariationsBoard({
  variations,
}: ExploreVariationsBoardProps) {
  const moveGraph = useMemo(() => buildMoveGraph(variations), [variations]);
  const startFen = variations[0].start_fen ?? "";
  const nav = useMemo(
    () => createGraphNavigator(moveGraph, startFen),
    [moveGraph, startFen]
  );
  const [game, setGame] = useState(new Chess(nav.fen));
  const [boardOrientation, setBoardOrientation] =
    useState<Orientation>("white");

  const choices = groupNextMoveEdges(nav.outgoing());

  const canPlayPreviousMove = !nav.atStart();
  const canPlayNextMove = nav.outgoing().length > 0;

  const playPreviousMove = () => {
    if (canPlayPreviousMove) {
      nav.prev();
      setGame(new Chess(nav.fen));
    }
  };

  const playNextMove = () => {
    if (canPlayNextMove) {
      const nextMove = nav.outgoing()[0];
      nav.next(nextMove);
      setGame(new Chess(nav.fen));
    }
  };

  const handleOnMove = (move: {
    from: string;
    to: string;
    promotion?: string;
  }) => {
    const gameCopy = new Chess(game.fen());
    const moveResult = gameCopy.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion ?? "q",
    });

    // Illegal move
    if (moveResult === null) return false;

    const newFen = gameCopy.fen();

    // Have to use nextFen because nav.next() hasn't been called yet
    const newMove = nav.outgoing().find((move) => move.next?.fen === newFen);
    if (newMove) {
      nav.next(newMove);
      setGame(new Chess(nav.fen));
    }

    return true;
  };

  const handleMoveClick = (move: MoveChoice) => {
    nav.next(move.edges[0]);
    setGame(new Chess(nav.fen));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
        <div className="sm:col-span-2">
          <ChessBoard
            game={game}
            onMove={handleOnMove}
            boardOrientation={boardOrientation}
          />
          <div className="flex justify-end gap-4 mt-2">
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
        <div className="sm:col-span-1 flex flex-col">
          <h4 className="text-lg font-semibold mb-2">Moves</h4>
          <MoveList
            moves={choices}
            onMoveClick={handleMoveClick}
            className="rounded-lg flex-1"
          />
        </div>
      </div>
    </div>
  );
}

interface MoveListProps {
  moves: MoveChoice[];
  onMoveClick: (move: MoveChoice) => void;
  className?: string;
}

function MoveList({ moves, onMoveClick, className }: MoveListProps) {
  return (
    <Card className={cn("overflow-y-auto p-4", className)}>
      <div className="flex flex-col gap-2">
        {moves.map((move) => (
          <Button
            key={move.san}
            variant="subtle"
            onClick={() => onMoveClick(move)}
            className="w-full"
          >
            {move.san}
          </Button>
        ))}
      </div>
    </Card>
  );
}
