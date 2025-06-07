import { CollectionWithSequences } from "@/lib/types/database.types";
import CollectionListItem from "./collection-list-item";

interface CollectionsListProps {
  collections: CollectionWithSequences[];
}

export default function CollectionsList({ collections }: CollectionsListProps) {
  return (
    <div className="flex flex-col">
      {collections.map((collection, index) => (
        <CollectionListItem
          key={collection.id}
          collection={collection}
          className={
            index < collections.length - 1 ? "border-b border-border" : ""
          }
        />
      ))}
    </div>
  );
}
