import { getCollectionsWithSequences } from "@/lib/api/collections";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const collection = await getCollectionsWithSequences();

  return <div>CollectionPage</div>;
}
