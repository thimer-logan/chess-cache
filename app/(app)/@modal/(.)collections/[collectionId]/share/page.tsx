import { getFriends } from "@/lib/api/friends";
import ShareCollectionDialog from "./share-collection-dialog";

export default async function ShareModal({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;

  const friends = await getFriends();

  return (
    <ShareCollectionDialog friends={friends} collectionId={collectionId} />
  );
}
