"use client";

import { CollectionWithSequences } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CollectionListItemProps {
  collection: CollectionWithSequences;
  className?: string;
}

export default function CollectionListItem({
  collection,
  className,
}: CollectionListItemProps) {
  return (
    <Link href={`/collections/${collection.id}`} className="hover:no-underline">
      <div
        className={cn(
          "flex items-center text-lg px-4 py-4 hover:bg-background rounded-lg transition-colors",
          className
        )}
      >
        <Image
          src={`/images/${collection.image || "shield.png"}`}
          alt="Chess"
          width={75}
          height={75}
          className="mr-2"
        />

        <span className="font-semibold text-xl">{collection.name}</span>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {collection.sequences.length}&nbsp;Sequences
          </span>
        </div>
      </div>
    </Link>
  );
}
