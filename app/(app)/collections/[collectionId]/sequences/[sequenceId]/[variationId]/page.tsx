import { getVariationWithLines } from "@/lib/api/variations";
import ExploreVariationsBoard from "@/components/boards/explore-variations-board";

export default async function VariationPage({
  params,
}: {
  params: Promise<{ sequenceId: string; variationId: string }>;
}) {
  const { variationId } = await params;
  const variation = await getVariationWithLines(variationId);

  return <ExploreVariationsBoard variations={[variation]} />;
}
