import { Move } from "./database.types";

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type MoveWithLine = WithOptional<Move, "id">;

export type ChessMove = Omit<Move, "id" | "variation_id">;

/* Move Graph types*/
export type FEN = string;
export type UUID = string | number;

export interface MoveEdge {
  current: MoveWithLine;
  next: MoveWithLine | null;
}

export interface MoveChoice {
  san: string;
  edges: MoveEdge[];
}

export type MoveGraph = Record<FEN, MoveEdge[]>;
export interface MoveGraphNavigator {
  readonly fen: FEN;
  readonly lastMove?: MoveEdge;
  readonly stack: readonly MoveEdge[];

  next(edge: MoveEdge): void;
  prev(): void;
  reset(fen?: FEN): void;

  outgoing(): MoveEdge[];
  atStart(): boolean;
  atEnd(): boolean;
}

export type ActionResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};
