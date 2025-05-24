"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Chess, validateFen } from "chess.js";
import { useMemo } from "react";
import {
  Chessboard,
  ChessboardDnDProvider,
  SparePiece,
} from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import { getPieceFromReactChessboard } from "@/lib/helpers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const pieces = [
  "wP",
  "wN",
  "wB",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bN",
  "bB",
  "bR",
  "bQ",
  "bK",
];

export interface ManualBoardProps {
  className?: string;
  dndId?: string;
}

export interface ManualBoardRef {
  getFen: () => string;
  getOrientation: () => "white" | "black";
}

const ManualBoard = forwardRef<ManualBoardRef, ManualBoardProps>(
  ({ className, dndId = "ManualBoardEditor" }, ref) => {
    const game = useMemo(
      () => new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true }),
      []
    ); // empty board
    const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
      "white"
    );
    const [boardWidth, setBoardWidth] = useState(360);
    const [fenPosition, setFenPosition] = useState(game.fen());

    useImperativeHandle(ref, () => ({
      getFen: () => game.fen(),
      getOrientation: () => boardOrientation,
    }));

    const handleSparePieceDrop = (piece: Piece, targetSquare: Square) => {
      const chessJsPiece = getPieceFromReactChessboard(piece);
      const success = game.put(chessJsPiece, targetSquare);
      if (success) {
        setFenPosition(game.fen());
      } else {
        alert(
          `The board already contains ${
            chessJsPiece.color === "w" ? "WHITE" : "BLACK"
          } KING`
        );
      }
      return success;
    };

    const handlePieceDrop = (
      sourceSquare: Square,
      targetSquare: Square,
      piece: Piece
    ) => {
      const chessJsPiece = getPieceFromReactChessboard(piece);

      // this is hack to avoid chess.js bug, which I've fixed in the latest version https://github.com/jhlywa/chess.js/pull/426
      game.remove(sourceSquare);
      game.remove(targetSquare);
      const success = game.put(chessJsPiece, targetSquare);
      if (success) setFenPosition(game.fen());
      return success;
    };

    const handlePieceDropOffBoard = (sourceSquare: Square) => {
      game.remove(sourceSquare);
      setFenPosition(game.fen());
    };

    const handleFenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fen = e.target.value;
      const { ok: valid } = validateFen(fen);
      setFenPosition(fen);
      if (valid) {
        game.load(fen);
        setFenPosition(game.fen());
      }
    };
    console.log(boardWidth);
    return (
      <div className={cn("my-0 mx-auto w-full", className)}>
        <ChessboardDnDProvider>
          <div>
            <div
              style={{
                display: "flex",
                margin: `${boardWidth / 32}px ${boardWidth / 8}px`,
              }}
            >
              {pieces.slice(6, 12).map((piece) => (
                <div
                  key={piece}
                  className={`w-[${boardWidth / 8}px] h-[${
                    boardWidth / 8
                  }px] flex items-center justify-center`}
                >
                  <SparePiece
                    piece={piece as Piece}
                    width={boardWidth / 8}
                    dndId={dndId}
                  />
                </div>
              ))}
            </div>
            <Chessboard
              onBoardWidthChange={setBoardWidth}
              id={dndId}
              boardOrientation={boardOrientation}
              position={game.fen()}
              onSparePieceDrop={handleSparePieceDrop}
              onPieceDrop={handlePieceDrop}
              onPieceDropOffBoard={handlePieceDropOffBoard}
              dropOffBoardAction="trash"
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            />
            <div className="flex justify-center mt-2">
              {pieces.slice(0, 6).map((piece) => (
                <SparePiece
                  key={piece}
                  piece={piece as Piece}
                  width={boardWidth / 8}
                  dndId={dndId}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 my-2">
            <Button
              variant="outline"
              onClick={() => {
                game.reset();
                setFenPosition(game.fen());
              }}
            >
              Start position ♟️
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                game.clear();
                setFenPosition(game.fen());
              }}
            >
              Clear board 🗑️
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBoardOrientation(
                  boardOrientation === "white" ? "black" : "white"
                );
              }}
            >
              Flip board 🔁
            </Button>
          </div>
          <Input
            value={fenPosition}
            onChange={handleFenInputChange}
            placeholder="Paste FEN position to start editing"
          />
        </ChessboardDnDProvider>
      </div>
    );
  }
);

ManualBoard.displayName = "ManualBoard";

export default ManualBoard;
