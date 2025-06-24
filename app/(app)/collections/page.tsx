import { getCollectionsWithSequences } from "@/lib/api/collections";
import CollectionsCard from "@/components/collections-card";
import { getUserProfile } from "@/lib/api/user";

export default async function HomePage() {
  const [user, collections] = await Promise.all([
    getUserProfile(),
    getCollectionsWithSequences(),
  ]);

  const myCollections = collections.filter(
    (collection) => collection.user_id === user?.id
  );
  const sharedCollections = collections.filter(
    (collection) => collection.user_id !== user?.id
  );

  return (
    <div className="flex flex-col flex-1 gap-4">
      <CollectionsCard
        collections={myCollections}
        title="My Collections"
        canAdd={true}
        emptyMessage="No collections found. Create one to get started!"
      />
      <CollectionsCard
        collections={sharedCollections}
        title="Shared Collections"
        canAdd={false}
        emptyMessage="No shared collections found."
      />
    </div>
  );
}
