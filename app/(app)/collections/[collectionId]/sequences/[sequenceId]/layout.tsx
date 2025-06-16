import { getSequenceWithVariations } from "@/lib/api/sequences";
import VariationSelect from "./variation-select";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Share } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IfOwner } from "@/lib/contexts/collection-acl";
import { getCollectionById } from "@/lib/api/collections";

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
        <CardHeader className="flex items-center gap-2">
          <Image
            src={`/images/${collection.image || "shield.png"}`}
            alt="Chess"
            width={50}
            height={50}
          />
          <CardTitle className="text-xl font-bold">{collection.name}</CardTitle>
          <IfOwner>
            <div className="inline-flex items-center gap-2 ml-auto">
              <Button>
                <Share />
                Share
              </Button>
            </div>
          </IfOwner>
        </CardHeader>
      </Card>
      <div className="flex flex-col gap-6 w-full px-4">
        <h2 className="text-2xl font-bold">{sequence.name}</h2>
        <div className="flex justify-between items-center">
          <VariationSelect
            collectionId={collectionId}
            sequenceId={sequenceId}
            variations={sequence.variations}
          />
          <Button asChild>
            <Link
              href={`/collections/${collectionId}/sequences/${sequenceId}/new`}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Variation
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
