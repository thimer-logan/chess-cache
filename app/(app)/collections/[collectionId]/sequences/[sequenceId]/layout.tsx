import { getSequenceWithVariations } from "@/lib/api/sequences";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
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
          <Link
            href={`/collections/${collectionId}`}
            prefetch={false}
            scroll={false}
          >
            <CardTitle className="text-xl font-bold">
              {collection.name}
            </CardTitle>
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
      </Card>
      <div className="flex flex-col gap-6 w-full px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{sequence.name}</h2>
          <Button asChild variant="link">
            <Link href={`/collections/${collectionId}/sequences/${sequenceId}`}>
              All Variations
            </Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
