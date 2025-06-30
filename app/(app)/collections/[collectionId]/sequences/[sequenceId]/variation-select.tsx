"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VariationWithLines } from "@/lib/types/database.types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

interface VariationSelectProps {
  collectionId: string;
  sequenceId: string;
  variations: VariationWithLines[];
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
        <SelectSeparator />
        {sortedVariations.map((variation) => (
          <SelectItem key={variation.id} value={variation.id.toString()}>
            <div className="flex flex-col gap-1">
              {variation.name}
              <Badge variant="secondary">
                {variation.lines?.length ?? 0} lines
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
