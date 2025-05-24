"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Variation } from "@/lib/types/database.types";
import { useParams, useRouter } from "next/navigation";

interface VariationSelectProps {
  sequenceId: string;
  variations: Variation[];
}

export default function VariationSelect({
  sequenceId,
  variations,
}: VariationSelectProps) {
  const { variationId } = useParams();
  const router = useRouter();

  function handleChange(variationId: string) {
    router.push(`/sequences/${sequenceId}/${variationId}`);
  }

  return (
    <Select onValueChange={handleChange} defaultValue={variationId as string}>
      <SelectTrigger>
        <SelectValue placeholder="Select a variation" />
      </SelectTrigger>
      <SelectContent>
        {variations.map((variation) => (
          <SelectItem key={variation.id} value={variation.id.toString()}>
            {variation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
