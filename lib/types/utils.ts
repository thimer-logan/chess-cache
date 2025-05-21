import { Move } from "./database.types";

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type MoveWithVariation = WithOptional<Move, "id">;

export type ChessMove = Omit<Move, "id" | "variation_id">;
