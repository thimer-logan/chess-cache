import { Piece as ChessJsPiece, Color, PieceSymbol } from "chess.js";
import { Piece as ReactChessboardPiece } from "react-chessboard/dist/chessboard/types";
import { VariationWithLines } from "./types/database.types";
import {
  FEN,
  MoveGraphNavigator,
  MoveChoice,
  MoveEdge,
  MoveGraph,
} from "./types/utils";

export function getPieceFromChessJs(piece: ChessJsPiece): ReactChessboardPiece {
  return `${piece.color}${piece.type}` as ReactChessboardPiece;
}

export function getPieceFromReactChessboard(
  piece: ReactChessboardPiece
): ChessJsPiece {
  return {
    color: piece[0] as Color,
    type: piece[1] as PieceSymbol,
  };
}

export function buildMoveGraph(variations: VariationWithLines[]): MoveGraph {
  const graph: MoveGraph = Object.create(null); // clean dict, no proto keys

  for (const v of variations) {
    for (const line of v.lines) {
      // Sort moves by ply once; guarantees sequential order
      const ordered = [...line.moves].sort((a, b) => a.ply - b.ply);

      ordered.forEach((m, idx) => {
        const next = ordered[idx + 1] ?? null;
        const edge: MoveEdge = {
          current: m,
          next,
        };

        (graph[m.fen] ??= []).push(edge); // push into array (create if miss)
      });

      if (v.start_fen && ordered.length) {
        const first = ordered[0];
        const virtualEdge: MoveEdge = {
          current: {
            fen: v.start_fen,
            ply: 0,
            san: "(start)",
            line_id: line.id,
          },
          next: first,
        };
        (graph[v.start_fen] ??= []).push(virtualEdge);
      }
    }
  }

  return graph;
}

export function createGraphNavigator(
  graph: MoveGraph,
  startFen: FEN
): MoveGraphNavigator {
  let currentFen = startFen;
  const history: MoveEdge[] = [];

  function outgoing(): MoveEdge[] {
    // fall back to an empty array so callers never null-check
    return graph[currentFen] ?? [];
  }

  return {
    get fen() {
      return currentFen;
    },
    get lastMove() {
      return history[history.length - 1];
    },
    get stack() {
      return history;
    },

    next(edge: MoveEdge) {
      if (edge.current.fen !== currentFen) {
        throw new Error("Edge does not leave current position");
      }
      if (edge.next === null) {
        return;
      }
      history.push(edge);
      currentFen = edge.next.fen;
    },

    prev() {
      if (history.length === 0) return;
      const edge = history.pop()!;
      currentFen = edge.current.fen;
    },

    reset(fen = startFen) {
      currentFen = fen;
      history.length = 0;
    },

    outgoing,
    atStart: () => history.length === 0,
    atEnd: () => outgoing().length === 0,
  };
}

export function groupNextMoveEdges(edges: MoveEdge[]): MoveChoice[] {
  if (edges.length === 0) return [];
  const map = new Map<string, MoveEdge[]>();

  for (const e of edges) {
    if (e.next) {
      (map.get(e.next.san) ?? map.set(e.next.san, []).get(e.next.san)!)!.push(
        e
      );
    }
  }

  return Array.from(map, ([san, edges]) => ({ san, edges }));
}
