import { Chess, Square, Move } from "chess.js";
import { ChessMove } from "./types/utils";

class ChessWrapper {
  chess: Chess;
  moveHistory: Move[];
  currentPosition: number;
  initialPosition: string;
  isReset: boolean = false;
  hasMoved: boolean = false;

  constructor(moves?: ChessMove[], initialPosition?: string) {
    this.chess = new Chess();
    this.chess.load(initialPosition ?? this.chess.fen());
    this.initialPosition = initialPosition ?? this.chess.fen();
    this.moveHistory = [];
    this.currentPosition = -1;

    if (moves && moves.length > 0) {
      const tempChess = new Chess();
      tempChess.load(this.initialPosition);
      // Store moves without applying them
      moves.forEach((move) => {
        const result = tempChess.move(move.san);
        if (result) {
          this.moveHistory.push(result);
        }
      });
    }
  }

  getOrientation() {
    return this.chess.turn() === "w" ? "white" : "black";
  }

  move(
    move:
      | string
      | {
          from: string;
          to: string;
          promotion?: string;
        }
  ) {
    const moved = this.chess.move(move);

    if (!moved) {
      return null;
    }

    this.hasMoved = true;

    // If we're not at the end of the move history, truncate it
    if (this.currentPosition < this.moveHistory.length - 1) {
      this.moveHistory = this.moveHistory.slice(0, this.currentPosition + 1);
    }

    this.moveHistory.push(moved);
    this.currentPosition++;

    return moved;
  }

  reset() {
    this.isReset = true;
    this.chess.load(this.initialPosition);
    this.moveHistory = [];
    this.currentPosition = -1;
  }

  undo() {
    if (this.currentPosition < 0) return;

    this.chess.undo();
    this.currentPosition--;
  }

  redo() {
    if (this.currentPosition >= this.moveHistory.length - 1) return;

    this.currentPosition++;
    const move = this.moveHistory[this.currentPosition];
    this.chess.move(move);
  }

  getMoveOptions(square: Square) {
    return this.chess.moves({
      square,
      verbose: true,
    });
  }

  getPosition() {
    return this.chess.fen();
  }

  getInitialPosition() {
    return this.initialPosition;
  }

  getHistory() {
    return this.moveHistory.map((move, index) => ({
      fen: move.after,
      ply: index,
      san: move.san,
    }));
  }

  getCurrentIndex() {
    return this.currentPosition;
  }

  isFirstMove() {
    return this.currentPosition === -1;
  }

  isLastMove() {
    return this.currentPosition === this.moveHistory.length - 1;
  }

  playNextMove() {
    if (this.currentPosition >= this.moveHistory.length - 1) return;

    this.currentPosition++;
    const move = this.moveHistory[this.currentPosition];
    this.chess.move(move);
  }

  playPreviousMove() {
    if (this.currentPosition < 0) {
      this.chess.load(this.initialPosition);
      return;
    }

    this.chess.undo();
    this.currentPosition--;
  }

  getCurrentPly() {
    return this.currentPosition;
  }

  goToPly(ply: number) {
    if (ply < 0 || ply >= this.moveHistory.length) {
      return false;
    }
    this.currentPosition = ply;
    this.chess.load(this.moveHistory[ply].after);
    return true;
  }
}

export default ChessWrapper;
