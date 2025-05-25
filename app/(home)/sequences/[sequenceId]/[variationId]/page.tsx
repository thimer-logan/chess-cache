import { getVariation, getVariationMoves } from "@/lib/api/variations";
import ClientPage from "./client-page";

export default async function VariationPage({
  params,
}: {
  params: Promise<{ sequenceId: string; variationId: string }>;
}) {
  const { variationId } = await params;
  const variation = await getVariation(variationId);
  const moves = await getVariationMoves(variationId);

  return <ClientPage moves={moves} variation={variation} />;
}
