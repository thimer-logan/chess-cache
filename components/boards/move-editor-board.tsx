"use client";

import { useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { Square } from "react-chessboard/dist/chessboard/types";
import {
  ChevronLeft,
  ChevronRight,
  FlipVertical2,
  Redo2,
  Undo2,
} from "lucide-react";
import { Move, Orientation, Variation } from "@/lib/types/database.types";
import ChessWrapper from "@/lib/chess-wrapper";

interface MoveEditorBoardProps {
  variation: Variation;
  moves: Move[];
}

type Squares = Record<
  Square,
  { background?: string; borderRadius?: string; backgroundColor?: string }
>;

export interface MoveEditorBoardRef {
  getGameHistory: () => ReturnType<ChessWrapper["getHistory"]>;
}

const MoveEditorBoard = forwardRef<MoveEditorBoardRef, MoveEditorBoardProps>(
  ({ moves, variation }, ref) => {
    const game = useMemo(
      () => new ChessWrapper(moves, variation.start_fen ?? undefined),
      [moves, variation.start_fen]
    );
    const [boardPosition, setBoardPosition] = useState(
      game.getInitialPosition()
    );
    const [moveFrom, setMoveFrom] = useState<Square | null>(null);
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [rightClickedSquares, setRightClickedSquares] = useState<Squares>(
      {} as Squares
    );
    const [optionSquares, setOptionSquares] = useState<Squares>({} as Squares);
    const [boardOrientation, setBoardOrientation] = useState<Orientation>(
      variation.orientation
    );
    const canUndo = !game.isFirstMove();
    const canRedo = !game.isLastMove();
    const canPlayPreviousMove = !game.isFirstMove();
    const canPlayNextMove = !game.isLastMove();

    useImperativeHandle(ref, () => ({
      getGameHistory: () => game.getHistory(),
    }));

    // useEffect(() => {
    //   setBoardPosition(game.getPosition());
    // }, [game]);

    function getMoveOptions(square: Square) {
      const moves = game.getMoveOptions(square);
      if (!moves) return null;
      const newSquares: Squares = {};
      moves.map((move) => {
        newSquares[move.to] = {
          background:
            "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
          borderRadius: "50%",
        };
        return move;
      });
      newSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };
      setOptionSquares(newSquares);
      return true;
    }

    function onSquareClick(square: Square) {
      setRightClickedSquares({} as Squares);

      // from square
      if (!moveFrom) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      // to square
      if (!moveTo) {
        // check if valid move before showing dialog
        const moves = game.getMoveOptions(moveFrom);
        const foundMove = moves.find(
          (m) => m.from === moveFrom && m.to === square
        );
        // not a valid move
        if (!foundMove) {
          // check if clicked on new piece
          const hasMoveOptions = getMoveOptions(square);
          // if new piece, setMoveFrom, otherwise clear moveFrom
          setMoveFrom(hasMoveOptions ? square : null);
          return;
        }

        // valid move
        setMoveTo(square);

        // if promotion move
        if (
          (foundMove.color === "w" &&
            foundMove.piece === "p" &&
            square[1] === "8") ||
          (foundMove.color === "b" &&
            foundMove.piece === "p" &&
            square[1] === "1")
        ) {
          setShowPromotionDialog(true);
          return;
        }

        // is normal move
        const move = makeAMove({
          from: moveFrom,
          to: square,
          promotion: "q",
        });

        // if invalid, setMoveFrom and getMoveOptions
        if (move === null) {
          const hasMoveOptions = getMoveOptions(square);
          if (hasMoveOptions) setMoveFrom(square);
          return;
        }

        setMoveFrom(null);
        setMoveTo(null);
        setOptionSquares({} as Squares);
        return;
      }
    }

    function onSquareRightClick(square: Square) {
      const colour = "rgba(0, 0, 255, 0.4)";
      setRightClickedSquares({
        ...rightClickedSquares,
        [square]:
          rightClickedSquares[square] &&
          rightClickedSquares[square].backgroundColor === colour
            ? undefined
            : {
                backgroundColor: colour,
              },
      });
    }

    // Make a move
    const makeAMove = (move: {
      from: string;
      to: string;
      promotion?: string;
    }) => {
      try {
        const result = game.move(move);
        setBoardPosition(game.getPosition());
        return result;
      } catch {
        return null;
      }
    };

    // Handle piece drop
    const onDrop = (sourceSquare: string, targetSquare: string) => {
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      // Illegal move
      if (move === null) return false;
      return true;
    };

    // Undo last move
    const undoMove = () => {
      game.undo();
      setBoardPosition(game.getPosition());
    };

    const redoMove = () => {
      game.redo();
      setBoardPosition(game.getPosition());
    };

    const playPreviousMove = () => {
      game.playPreviousMove();
      setBoardPosition(game.getPosition());
    };

    const playNextMove = () => {
      game.playNextMove();
      setBoardPosition(game.getPosition());
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-1 gap-4 w-full max-w-[600px]">
          <div className="flex justify-center w-full">
            <Chessboard
              position={boardPosition}
              boardOrientation={boardOrientation}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              customSquareStyles={{
                ...optionSquares,
                ...rightClickedSquares,
              }}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              promotionToSquare={moveTo}
              showPromotionDialog={showPromotionDialog}
              id="MoveEditorBoard"
            />
          </div>
          <div className="flex gap-4 justify-end">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={undoMove} disabled={!canUndo}>
                <Undo2 />
              </Button>
              <Button variant="outline" onClick={redoMove} disabled={!canRedo}>
                <Redo2 />
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
      </div>
    );
  }
);

MoveEditorBoard.displayName = "MoveEditorBoard";

export default MoveEditorBoard;
