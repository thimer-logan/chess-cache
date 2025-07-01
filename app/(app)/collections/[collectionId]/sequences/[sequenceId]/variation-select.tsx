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
import { useMemo, useRef, useEffect, useState } from "react";

interface VariationSelectProps {
  collectionId: string;
  sequenceId: string;
  variations: VariationWithLines[];
}

function VariationDisplay({ variation }: { variation: VariationWithLines }) {
  const [isSelectValue, setIsSelectValue] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a hack to check if the variation is being displayed in the select value
    if (ref.current) {
      const parent = ref.current.parentElement;
      setIsSelectValue(parent?.getAttribute("data-slot") === "select-value");
    }
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {variation.name}
      {!isSelectValue && (
        <Badge variant="secondary">{variation.lines?.length ?? 0} lines</Badge>
      )}
    </div>
  );
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
            <VariationDisplay variation={variation} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
