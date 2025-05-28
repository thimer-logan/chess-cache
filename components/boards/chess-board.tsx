"use client";

import { useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  ChessboardProps,
  CustomSquareStyles,
  Piece,
  Square,
} from "react-chessboard/dist/chessboard/types";

export interface ChessBoardProps extends ChessboardProps {
  game: Chess;
  onMove?: (move: { from: string; to: string; promotion?: string }) => boolean;
}

export interface ChessBoardRef {
  getGameHistory: () => ReturnType<Chess["history"]>;
}

const getMoveOptions = (game: Chess, square: Square) => {
  const moves = game.moves({
    square,
    verbose: true,
  });
  if (moves.length === 0) {
    return [];
  }
  const newSquares: Square[] = moves.map((move) => move.to);
  return newSquares;
};

const ChessBoard = forwardRef<ChessBoardRef, ChessBoardProps>(
  ({ game, onMove, ...props }, ref) => {
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [rightClickedSquares, setRightClickedSquares] = useState<Square[]>(
      []
    );
    // const [optionSquares, setOptionSquares] = useState<Square[]>([]);
    const optionSquares = useMemo(() => {
      if (!selectedSquare) return [];
      return getMoveOptions(game, selectedSquare);
    }, [game, selectedSquare]);

    const selectedSquareStyles: CustomSquareStyles = useMemo(
      () =>
        selectedSquare
          ? {
              [selectedSquare]: {
                background: "rgba(255, 255, 0, 0.4)",
              },
            }
          : {},
      [selectedSquare]
    );

    const optionSquareStyles: CustomSquareStyles = useMemo(
      () =>
        Object.fromEntries(
          optionSquares.map((square) => [
            square,
            {
              background:
                selectedSquare &&
                game.get(square) &&
                game.get(square)?.color !== game.get(selectedSquare)?.color
                  ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                  : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
              borderRadius: "50%",
            },
          ])
        ),
      [game, optionSquares, selectedSquare]
    );

    const rightClickedSquareStyles: CustomSquareStyles = useMemo(
      () =>
        Object.fromEntries(
          rightClickedSquares.map((square) => [
            square,
            { backgroundColor: "rgba(0, 0, 255, 0.4)" },
          ])
        ),
      [rightClickedSquares]
    );

    useImperativeHandle(ref, () => ({
      getGameHistory: () => game.history({ verbose: true }),
    }));

    function handleSquareClick(square: Square) {
      setRightClickedSquares([]);

      if (!selectedSquare) {
        return;
      }

      if (!moveTo) {
        // Check if valid move before showing dialog
        const moves = game.moves({
          square: selectedSquare,
          verbose: true,
        });
        const foundMove = moves.find(
          (m) => m.from === selectedSquare && m.to === square
        );

        if (!foundMove) {
          return;
        }

        setMoveTo(square);

        // Check if promotion move
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

        const move = onMove?.({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });

        if (move === false) {
          return;
        }

        setSelectedSquare(null);
        setMoveTo(null);
        return;
      }
    }

    function handleSquareRightClick(square: Square) {
      // Add square to rightClickedSquares if it is not already in the array.
      // If it is already in the array, remove it.
      if (rightClickedSquares.includes(square)) {
        setRightClickedSquares(rightClickedSquares.filter((s) => s !== square));
      } else {
        setRightClickedSquares([...rightClickedSquares, square]);
      }
    }

    function handlePieceDragBegin(piece: Piece, square: Square) {
      setSelectedSquare(square);
    }

    function handlePieceDragEnd() {
      setSelectedSquare(null);
    }

    function handlePieceClick(piece: Piece, square: Square) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      setSelectedSquare(square);
    }

    // Handle piece drop
    const handlePieceDrop = (
      sourceSquare: Square,
      targetSquare: Square,
      piece: Piece
    ) => {
      const move = onMove?.({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      return move ?? false;
    };

    return (
      <Chessboard
        position={game.fen()}
        onPieceDrop={handlePieceDrop}
        onPieceDragBegin={handlePieceDragBegin}
        onPieceDragEnd={handlePieceDragEnd}
        onPieceClick={handlePieceClick}
        onSquareClick={handleSquareClick}
        onSquareRightClick={handleSquareRightClick}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        customSquareStyles={{
          ...optionSquareStyles,
          ...rightClickedSquareStyles,
          ...selectedSquareStyles,
        }}
        customBoardStyle={{
          borderRadius: "var(--radius)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        {...props}
      />
    );
  }
);

ChessBoard.displayName = "ChessBoard";

export default ChessBoard;
