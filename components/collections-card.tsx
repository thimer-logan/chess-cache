import { CollectionWithSequences } from "@/lib/types/database.types";
import { CollectionsAccordian } from "@/components/collections-accordian";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import NewCollectionDialog from "@/app/(home)/new-collection-dialog";
import { createSequenceAction } from "@/app/(home)/actions";
interface CollectionsCardProps {
  collections: CollectionWithSequences[];
  className?: string;
}

export default function CollectionsCard({
  collections,
  className,
}: CollectionsCardProps) {
  return (
    <Card className={cn("flex-1", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">Your Collections</CardTitle>
        <NewCollectionDialog />
      </CardHeader>
      <CardContent>
        <CollectionsAccordian
          collections={collections}
          createSequenceAction={createSequenceAction}
        />
      </CardContent>
    </Card>
  );
}
