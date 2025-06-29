"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Line } from "@/lib/types/database.types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

interface LineSelectProps {
  lines: Line[];
}

export default function LineSelect({ lines }: LineSelectProps) {
  const { collectionId, sequenceId, variationId, lineId } = useParams();
  const router = useRouter();
  const sortedLines = useMemo(
    () => lines.sort((a, b) => a.name.localeCompare(b.name)),
    [lines]
  );

  function handleChange(lineId: string) {
    if (lineId === "all") {
      router.push(
        `/collections/${collectionId}/sequences/${sequenceId}/${variationId}`
      );
    } else {
      router.push(
        `/collections/${collectionId}/sequences/${sequenceId}/${variationId}/${lineId}`
      );
    }
  }

  return (
    <Select
      onValueChange={handleChange}
      value={lineId ? (lineId as string) : "all"}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a line" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Lines</SelectItem>
        <Separator className="my-2" />
        {sortedLines.map((line) => (
          <SelectItem key={line.id} value={line.id.toString()}>
            {line.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
