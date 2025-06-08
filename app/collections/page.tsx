import { getCollectionsWithSequences } from "@/lib/api/collections";
import CollectionsCard from "@/components/collections-card";

export default async function HomePage() {
  const collections = await getCollectionsWithSequences();

  return <CollectionsCard collections={collections} />;
}
