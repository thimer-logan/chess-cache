import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionById } from "@/lib/api/collections";
import { getSequencesByCollectionId } from "@/lib/api/sequences";
import { IfOwner } from "@/lib/contexts/collection-acl";
import SequencesList from "@/components/sequences-list";
import { Pencil, Plus, Share, Trash2 } from "lucide-react";
import Image from "next/image";
import EditCollectionDialog from "./edit-collection-dialog";
import DeleteCollectionDialog from "./delete-collection-dialog";
import { notFound } from "next/navigation";
import Link from "next/link";
import NewSequenceDialog from "./new-sequence-dialog";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const collection = await getCollectionById(collectionId);
  const sequences = await getSequencesByCollectionId(collectionId);

  if (!collection) {
    notFound();
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex items-center gap-2 flex-wrap">
        <Image
          src={`/images/${collection.image || "shield.png"}`}
          alt="Chess"
          width={50}
          height={50}
        />
        <CardTitle className="text-2xl font-bold">{collection.name}</CardTitle>
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
            <EditCollectionDialog collection={collection}>
              <Button variant="outline" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </EditCollectionDialog>
            <DeleteCollectionDialog collectionId={collectionId}>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DeleteCollectionDialog>
          </div>
        </IfOwner>
      </CardHeader>
      <CardContent>
        <IfOwner>
          <NewSequenceDialog />
          <div className="flex justify-end items-center">
            <Button variant="outline" asChild>
              <Link href={`/collections/${collectionId}?new=true`}>
                <Plus className="w-4 h-4" />
                New Sequence
              </Link>
            </Button>
          </div>
        </IfOwner>
        <SequencesList sequences={sequences} />
      </CardContent>
    </Card>
  );
}
