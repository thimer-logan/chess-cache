"use client";

import MoveEditorBoard, {
  MoveEditorBoardRef,
} from "@/components/boards/move-editor-board";
import VariationBoard from "@/components/boards/variation-board";
import { Button } from "@/components/ui/button";
import { Move, Variation } from "@/lib/types/database.types";
import { useRef, useState } from "react";
import { ChessMove, MoveWithVariation } from "@/lib/types/utils";
import { saveVariationMovesAction } from "./actions";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ClientPageProps {
  moves: Move[];
  variation: Variation;
}

export default function ClientPage({ moves, variation }: ClientPageProps) {
  const moveEditorBoardRef = useRef<MoveEditorBoardRef>(null);
  const [isEditing, setIsEditing] = useState(moves.length === 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (moveEditorBoardRef.current) {
      try {
        setIsLoading(true);
        const history =
          moveEditorBoardRef.current.getGameHistory() as ChessMove[];
        const moves: MoveWithVariation[] = history.map((move: ChessMove) => ({
          ...move,
          variation_id: variation.id,
        }));
        console.log(moves);
        await saveVariationMovesAction(
          variation.id,
          variation.sequence_id,
          moves
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving variation moves:", error);
        toast.error("Failed to save variation moves");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-2">
          <Button onClick={() => setIsEditing(false)} variant="outline">
            <ArrowLeft /> Back
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        <MoveEditorBoard
          variation={variation}
          moves={moves}
          ref={moveEditorBoardRef}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <Button onClick={() => setIsEditing(true)}>
          <Pencil /> Edit
        </Button>
      </div>
      <VariationBoard moves={moves} variation={variation} />
    </div>
  );
}
