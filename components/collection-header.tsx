import Image from "next/image";
import { CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { IfOwner } from "@/lib/contexts/collection-acl";
import { Button } from "./ui/button";
import { Share } from "lucide-react";
import { Collection } from "@/lib/types/database.types";

interface CollectionHeaderProps
  extends React.ComponentProps<typeof CardHeader> {
  collectionId: string;
  collection: Collection;
}

export default async function CollectionHeader({
  collectionId,
  collection,
  ...cardHeaderProps
}: CollectionHeaderProps) {
  return (
    <CardHeader className="flex items-center gap-2" {...cardHeaderProps}>
      <Image
        src={`/images/${collection.image || "shield.png"}`}
        alt="Chess"
        width={50}
        height={50}
      />
      <Link
        href={`/collections/${collectionId}`}
        prefetch={false}
        scroll={false}
      >
        <CardTitle className="text-xl font-bold">{collection.name}</CardTitle>
      </Link>
      <IfOwner>
        <div className="inline-flex items-center gap-2 ml-auto">
          <Button asChild>
            <Link
              href={`/collections/${collectionId}/share`}
              prefetch={false}
              scroll={false}
            >
              <Share />
              Share
            </Link>
          </Button>
        </div>
      </IfOwner>
    </CardHeader>
  );
}
