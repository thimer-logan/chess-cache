import { getVariationWithLines } from "@/lib/api/variations";
import CreateLineDialog from "./create-line-dialog";

export default async function NewLineModal({
  params,
}: {
  params: Promise<{
    collectionId: string;
    sequenceId: string;
    variationId: string;
  }>;
}) {
  const { variationId } = await params;
  const variation = await getVariationWithLines(variationId);

  return <CreateLineDialog variation={variation} />;
}
