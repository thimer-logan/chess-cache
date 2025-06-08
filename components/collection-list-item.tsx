"use client";

import { CollectionWithSequences } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface CollectionListItemProps {
  collection: CollectionWithSequences;
  className?: string;
}

export default function CollectionListItem({
  collection,
  className,
}: CollectionListItemProps) {
  const router = useRouter();

  const handleDelete = () => {
    const params = new URLSearchParams();
    params.set("delete", "true");
    params.set("collectionId", collection.id.toString());
    router.push(`?${params.toString()}`);
  };

  const handleEdit = () => {
    const params = new URLSearchParams();
    params.set("edit", "true");
    params.set("collectionId", collection.id.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "flex items-center text-lg px-4 py-4 hover:bg-background rounded-lg transition-colors",
        className
      )}
    >
      <Image
        src={`/images/${collection.image || "shield.png"}`}
        alt="Chess"
        width={50}
        height={50}
        className="mr-2"
      />
      <Link
        href={`/collections/${collection.id}`}
        className="hover:no-underline"
      >
        <div className="flex flex-col gap-1 px-2 py-1">
          <span className="font-semibold text-xl">{collection.name}</span>
          <span className="text-sm text-muted-foreground">
            {collection.sequences.length}&nbsp;Sequences
          </span>
        </div>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
