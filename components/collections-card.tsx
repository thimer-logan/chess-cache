import { CollectionWithSequences } from "@/lib/types/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import NewCollectionDialog from "@/app/(app)/collections/new-collection-dialog";
import CollectionsList from "./collections-list";
interface CollectionsCardProps {
  collections: CollectionWithSequences[];
  className?: string;
  title: string;
  canAdd?: boolean;
  emptyMessage?: string;
}

export default function CollectionsCard({
  collections,
  className,
  title,
  canAdd = true,
  emptyMessage,
}: CollectionsCardProps) {
  return (
    <Card className={cn("flex-1", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {canAdd && <NewCollectionDialog />}
      </CardHeader>
      <CardContent>
        <CollectionsList
          collections={collections}
          emptyMessage={emptyMessage}
        />
      </CardContent>
    </Card>
  );
}
