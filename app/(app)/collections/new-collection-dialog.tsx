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
import { useState } from "react";
import { toast } from "sonner";
import { createCollectionAction } from "./actions";
import Image from "next/image";
import { CHESS_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SubmitButton from "@/components/submit-button";

export default function NewCollectionDialog() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);

    const result = await createCollectionAction({
      name: name.trim(),
      image,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setOpen(false);
    setName("");
    setImage("");
    toast.success("Collection created successfully");
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
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
            placeholder="Enter collection name"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Label htmlFor="image" className="text-right">
            Image
          </Label>
          <div className="col-span-3 flex items-center flex-wrap gap-2">
            {CHESS_IMAGES.map((img) => (
              <Image
                key={img}
                src={`/images/${img}`}
                alt={`${img}`}
                width={60}
                height={60}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md",
                  image === img
                    ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-lg"
                    : ""
                )}
                onClick={() => setImage(img)}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <SubmitButton
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={!name.trim() || !image || isLoading}
          >
            Create
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
