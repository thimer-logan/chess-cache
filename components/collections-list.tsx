import { CollectionWithSequences } from "@/lib/types/database.types";
import CollectionListItem from "./collection-list-item";

interface CollectionsListProps {
  collections: CollectionWithSequences[];
  emptyMessage?: string;
}

export default function CollectionsList({
  collections,
  emptyMessage,
}: CollectionsListProps) {
  return (
    <div className="flex flex-col">
      {collections.length > 0 ? (
        collections.map((collection, index) => (
          <CollectionListItem
            key={collection.id}
            collection={collection}
            className={
              index < collections.length - 1 ? "border-b border-border" : ""
            }
          />
        ))
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
}
