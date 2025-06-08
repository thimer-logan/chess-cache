import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCollectionById } from "@/lib/api/collections";
import { getSequencesByCollectionId } from "@/lib/api/sequences";
import { IfOwner } from "@/lib/contexts/collection-acl";
import SequencesList from "@/components/sequences-list";
import { Share } from "lucide-react";
import Image from "next/image";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const collection = await getCollectionById(collectionId);
  const sequences = await getSequencesByCollectionId(collectionId);

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex items-center gap-2">
        <Image
          src={`/images/${collection.image || "shield.png"}`}
          alt="Chess"
          width={50}
          height={50}
        />
        <CardTitle className="text-2xl font-bold">{collection.name}</CardTitle>
        <IfOwner>
          <div className="inline-flex items-center gap-6 ml-auto">
            <div className="flex flex-col items-center gap-2">
              <Button>
                <Share />
                Share
              </Button>
            </div>
          </div>
        </IfOwner>
      </CardHeader>
      <CardContent>
        <SequencesList sequences={sequences} />
      </CardContent>
    </Card>
  );
}
