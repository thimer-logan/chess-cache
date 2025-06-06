"use client";

import ManualBoard, { ManualBoardRef } from "@/components/boards/manual-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createVariationAction } from "./actions";

export default function NewVariationForm({
  sequenceId,
}: {
  sequenceId: string;
}) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const boardRef = useRef<ManualBoardRef>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a variation name");
      return;
    }

    const startFen = boardRef.current?.getFen();
    if (!startFen) {
      toast.error("Please set a start position");
      return;
    }

    const orientation = boardRef.current?.getOrientation();
    if (!orientation) {
      toast.error("Please set an orientation");
      return;
    }

    setIsLoading(true);

    await createVariationAction({
      name: name.trim(),
      sequence_id: parseInt(sequenceId),
      start_fen: startFen,
      orientation: orientation,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          placeholder="Enter variation name"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Label className="text-right self-start pt-2">Start Position</Label>
        <div className="col-span-3 max-w-96">
          <ManualBoard ref={boardRef} />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!name.trim() || isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
