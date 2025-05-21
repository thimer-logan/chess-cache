import { Chess, Square } from "chess.js";
import { ChessMove } from "./types/utils";

class ChessWrapper {
  chess: Chess;
  history: ChessMove[];
  initialPosition: string;
  currentIndex: number;
  isReset?: boolean;

  constructor(moves?: ChessMove[], initialPosition?: string) {
    this.chess = new Chess();
    this.chess.load(initialPosition ?? this.chess.fen());
    this.initialPosition = initialPosition ?? this.chess.fen();

    this.history = [
      {
        fen: this.initialPosition,
        ply: 0,
        san: "",
      },
    ];

    if (moves && moves.length > 0) {
      this.history = [...this.history, ...moves];
      this.currentIndex = moves.length - 1;
    }

    this.currentIndex = 0;
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

    // Check if the board is not in the latest state of the history
    if (this.history.length !== this.currentIndex + 1) {
      const regression = this.history.length - (this.currentIndex + 1);
      this.history.splice(-regression);
    }

    this.history = [
      ...this.history,
      {
        fen: this.chess.fen(),
        ply: this.history.length,
        san: moved.san,
      },
    ];
    this.currentIndex++;

    return moved;
  }

  reset() {
    this.isReset = true;
    this.chess.reset();
    this.history = [];

    this.currentIndex = 0;
  }

  undo() {
    const previousPosition = this.history[this.currentIndex - 1];
    if (!previousPosition) {
      return;
    }

    this.chess.load(previousPosition.fen);
    this.currentIndex--;
  }

  redo() {
    const nextPosition = this.history[this.currentIndex + 1];

    if (!nextPosition) {
      return;
    }
    this.currentIndex++;
    this.chess.load(nextPosition.fen);
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
    return this.history.slice(1);
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  isFirstMove() {
    return this.currentIndex === 0;
  }

  isLastMove() {
    return this.currentIndex === this.history.length - 1;
  }

  playNextMove() {
    if (this.currentIndex >= this.history.length - 1) {
      return;
    }
    this.currentIndex++;
    console.log(this.history[this.currentIndex]);
    this.chess.load(this.history[this.currentIndex].fen);
  }

  playPreviousMove() {
    if (this.currentIndex <= 0) {
      this.chess.load(this.initialPosition);
      return;
    }
    this.currentIndex--;
    this.chess.load(this.history[this.currentIndex].fen);
  }
}

export default ChessWrapper;
