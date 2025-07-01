"use client";

import MoveEditorBoard, {
  MoveEditorBoardRef,
} from "@/components/boards/move-editor-board";
import VariationBoard from "@/components/boards/variation-board";
import { Button } from "@/components/ui/button";
import { LineWithMoves, Variation } from "@/lib/types/database.types";
import { useRef, useState } from "react";
import { ChessMove, MoveWithLine } from "@/lib/types/utils";
import { deleteLineAction, saveLineMovesAction } from "./actions";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { IfOwner, useCollectionAcl } from "@/lib/contexts/collection-acl";
import SubmitButton from "@/components/submit-button";

interface ClientPageProps {
  variation: Variation;
  line: LineWithMoves;
}

export default function ClientPage({ variation, line }: ClientPageProps) {
  const { canEdit } = useCollectionAcl();
  const moveEditorBoardRef = useRef<MoveEditorBoardRef>(null);
  const [isEditing, setIsEditing] = useState(
    canEdit && line.moves.length === 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const { collectionId } = useParams();

  const handleSave = async () => {
    if (!canEdit) {
      return;
    }
    if (moveEditorBoardRef.current) {
      try {
        setIsLoading(true);
        const history =
          moveEditorBoardRef.current.getGameHistory() as ChessMove[];
        const moves: MoveWithLine[] = history.map((move: ChessMove) => ({
          ...move,
          variation_id: variation.id,
        }));

        await saveLineMovesAction(
          line.id,
          variation.id,
          variation.sequence_id,
          collectionId as string,
          moves
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving moves:", error);
        toast.error("Failed to save moves for this line");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this line?")) {
      const result = await deleteLineAction(
        line.id,
        variation.id,
        variation.sequence_id,
        collectionId as string
      );
      if (result.ok) {
        toast.success("Line deleted successfully");
      } else {
        toast.error(result.error);
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
          <SubmitButton onClick={handleSave} isLoading={isLoading}>
            Save
          </SubmitButton>
        </div>
        <MoveEditorBoard
          variation={variation}
          moves={line.moves}
          ref={moveEditorBoardRef}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <IfOwner>
          <div className="flex gap-2">
            <Button onClick={handleEdit} disabled={!canEdit}>
              <Pencil /> Edit
            </Button>
            <Button
              variant="destructive"
              disabled={!canEdit}
              onClick={handleDelete}
            >
              <Trash /> Delete
            </Button>
          </div>
        </IfOwner>
      </div>
      <VariationBoard moves={line.moves} variation={variation} />
    </div>
  );
}
