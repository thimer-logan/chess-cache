"use client";

import { useState } from "react";
import { CategoryWithSequences } from "@/lib/types/database.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";
import { createSequence } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoriesAccordianProps {
  categories: CategoryWithSequences[];
}

export function CategoriesAccordian({ categories }: CategoriesAccordianProps) {
  const [isAddingSequence, setIsAddingSequence] = useState<string | null>(null);
  const [newSequenceName, setNewSequenceName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAddSequence = async (categoryId: number) => {
    if (!newSequenceName.trim()) return;

    try {
      setIsPending(true);
      await createSequence({
        name: newSequenceName.trim(),
        category_id: categoryId,
      });
      setNewSequenceName("");
      setIsAddingSequence(null);
      toast.success("Sequence created successfully");
    } catch (error) {
      console.error("Failed to create sequence:", error);
      toast.error("Failed to create sequence");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => (
        <AccordionItem
          key={category.id}
          value={category.id.toString()}
          className="border-b border-border px-4 py-2 data-[state=open]:bg-accent/10 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
            {category.name}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="space-y-4">
              {category.sequences.length > 0 ? (
                <div className="space-y-2">
                  {category.sequences.map((sequence) => (
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

              {isAddingSequence === category.id.toString() ? (
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
                        handleAddSequence(category.id);
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
                    onClick={() => handleAddSequence(category.id)}
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
                  onClick={() => setIsAddingSequence(category.id.toString())}
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
