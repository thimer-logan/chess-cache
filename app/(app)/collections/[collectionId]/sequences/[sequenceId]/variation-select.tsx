"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Variation } from "@/lib/types/database.types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

interface VariationSelectProps {
  collectionId: string;
  sequenceId: string;
  variations: Variation[];
}

export default function VariationSelect({
  collectionId,
  sequenceId,
  variations,
}: VariationSelectProps) {
  const { variationId } = useParams();
  const router = useRouter();
  const sortedVariations = useMemo(
    () => variations.sort((a, b) => a.name.localeCompare(b.name)),
    [variations]
  );

  function handleChange(variationId: string) {
    router.push(
      `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
    );
  }

  return (
    <Select onValueChange={handleChange} value={variationId as string}>
      <SelectTrigger>
        <SelectValue placeholder="Select a variation" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="explore">Explore all</SelectItem>
        <Separator className="my-2" />
        {sortedVariations.map((variation) => (
          <SelectItem key={variation.id} value={variation.id.toString()}>
            {variation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
