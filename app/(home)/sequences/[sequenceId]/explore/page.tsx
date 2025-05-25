import { getVariationsWithMoves } from "@/lib/api/variations";
import ExploreVariationsBoard from "@/components/boards/explore-variations-board";
export default async function ExplorePage({
  params,
}: {
  params: Promise<{ sequenceId: string }>;
}) {
  const { sequenceId } = await params;
  const variations = await getVariationsWithMoves(sequenceId);

  return (
    <div className="flex flex-col gap-4">
      <ExploreVariationsBoard variations={variations} />
    </div>
  );
}
