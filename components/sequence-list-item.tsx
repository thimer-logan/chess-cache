import { SequenceWithVariations } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SequenceListItemProps {
  sequence: SequenceWithVariations;
  className?: string;
}

export default function SequenceListItem({
  sequence,
  className,
}: SequenceListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center text-lg px-4 py-4 hover:bg-background rounded-lg transition-colors",
        className
      )}
    >
      <Link
        href={`/collections/${sequence.collection_id}/sequences/${sequence.id}`}
        className="hover:no-underline w-full"
      >
        <div className="flex flex-col gap-1 px-2 py-1">
          <span className="font-semibold text-xl">{sequence.name}</span>
          <span className="text-sm text-muted-foreground">
            {sequence.variations.length}&nbsp;Variations
          </span>
        </div>
      </Link>
    </div>
  );
}
