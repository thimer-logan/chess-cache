"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { createVariation } from "./actions";
import ManualBoard, { ManualBoardRef } from "@/components/boards/manual-board";

interface NewVariationDialogProps {
  sequenceId: number;
}

export default function NewVariationDialog({
  sequenceId,
}: NewVariationDialogProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
    try {
      await createVariation({
        name: name.trim(),
        sequence_id: sequenceId,
        start_fen: startFen,
        orientation: orientation,
      });

      setOpen(false);
      setName("");
      toast.success("Variation created successfully");
    } catch (error) {
      console.error("Error creating variation:", error);
      toast.error("Failed to create variation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          New Variation
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll overflow-x-hidden max-h-[95dvh]">
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Variation</DialogTitle>
          </DialogHeader>
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
            <Label className="text-right">Start Position</Label>
            <div className="col-span-4">
              <ManualBoard ref={boardRef} dndId="NewVariationDialog" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
