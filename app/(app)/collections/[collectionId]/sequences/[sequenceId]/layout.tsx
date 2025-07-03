import { getSequenceWithVariations } from "@/lib/api/sequences";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { IfOwner } from "@/lib/contexts/collection-acl";
import { getCollectionById } from "@/lib/api/collections";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CollectionHeader from "@/components/collection-header";
import { Separator } from "@/components/ui/separator";

export default async function SequenceLayout({
  params,
  children,
}: {
  params: Promise<{ collectionId: string; sequenceId: string }>;
  children: ReactNode;
}) {
  const { collectionId, sequenceId } = await params;
  const collection = await getCollectionById(collectionId);
  const sequence = await getSequenceWithVariations(sequenceId);

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="flex-1 py-3">
        <CollectionHeader collectionId={collectionId} collection={collection} />
      </Card>
      <div className="flex flex-col gap-6 w-full px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{sequence.name}</h2>
          <div className="flex items-center gap-2">
            <Button asChild variant="link">
              <Link
                href={`/collections/${collectionId}/sequences/${sequenceId}`}
              >
                All Variations
              </Link>
            </Button>
            <IfOwner>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/collections/${collectionId}/sequences/${sequenceId}?edit=true`}
                      prefetch={false}
                      scroll={false}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Sequence
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild variant="destructive">
                    <Link
                      href={`/collections/${collectionId}/sequences/${sequenceId}?delete=true`}
                      prefetch={false}
                      scroll={false}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Sequence
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </IfOwner>
          </div>
        </div>
        <Separator />
        {children}
      </div>
    </div>
  );
}
