"use client";

import { useState } from "react";
import { CollectionWithSequences, Sequence } from "@/lib/types/database.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionResult } from "@/lib/types/utils";

interface CollectionsAccordianProps {
  collections: CollectionWithSequences[];
  createSequenceAction: (sequence: {
    name: string;
    collection_id: number;
  }) => Promise<ActionResult<Sequence>>;
}

export function CollectionsAccordian({
  collections,
  createSequenceAction,
}: CollectionsAccordianProps) {
  const [isAddingSequence, setIsAddingSequence] = useState<string | null>(null);
  const [newSequenceName, setNewSequenceName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAddSequence = async (collectionId: number) => {
    if (!newSequenceName.trim()) return;

    setIsPending(true);
    const result = await createSequenceAction({
      name: newSequenceName.trim(),
      collection_id: collectionId,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setNewSequenceName("");
    setIsAddingSequence(null);
    toast.success("Sequence created successfully");
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {collections.map((collection) => (
        <AccordionItem
          key={collection.id}
          value={collection.id.toString()}
          className="border-b border-border px-4 py-2 data-[state=open]:bg-background hover:bg-background rounded-lg transition-colors"
        >
          <AccordionTrigger className="flex items-center text-lg font-semibold hover:no-underline cursor-pointer">
            <Image
              src="/images/shield.png"
              alt="Chess"
              width={50}
              height={50}
              className="mr-2"
            />
            {collection.name}
            <span className="ml-auto text-sm text-muted-foreground">
              {collection.sequences.length}&nbsp;Sequences
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="space-y-4">
              {collection.sequences.length > 0 ? (
                <div className="space-y-2">
                  {collection.sequences.map((sequence) => (
                    <p
                      key={sequence.id}
                      className="text-sm hover:bg-accent/30 p-2 rounded-md cursor-pointer transition-colors"
                      onClick={() => {
                        router.push(`/sequences/${sequence.id}`);
                      }}
                    >
                      {sequence.name}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No sequences</p>
              )}

              {isAddingSequence === collection.id.toString() ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter sequence name"
                    value={newSequenceName}
                    onChange={(e) => setNewSequenceName(e.target.value)}
                    className="flex-1"
                    autoFocus
                    disabled={isPending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isPending) {
                        handleAddSequence(collection.id);
                      } else if (e.key === "Escape") {
                        setIsAddingSequence(null);
                        setNewSequenceName("");
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsAddingSequence(null);
                      setNewSequenceName("");
                    }}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleAddSequence(collection.id)}
                    disabled={!newSequenceName.trim() || isPending}
                  >
                    {isPending ? "Adding..." : "Add"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsAddingSequence(collection.id.toString())}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sequence
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
