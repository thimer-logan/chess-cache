import { getVariation } from "@/lib/api/variations";
import ClientPage from "./client-page";
import { getLine } from "@/lib/api/lines";

export default async function VariationPage({
  params,
}: {
  params: Promise<{ sequenceId: string; variationId: string; lineId: string }>;
}) {
  const { variationId, lineId } = await params;
  const variation = await getVariation(variationId);
  const line = await getLine(lineId);

  return <ClientPage variation={variation} line={line} />;
}
