import NewVariationForm from "./new-variation-form";

export default async function NewVariationPage({
  params,
}: {
  params: Promise<{ collectionId: string; sequenceId: string }>;
}) {
  const { collectionId, sequenceId } = await params;

  return (
    <NewVariationForm collectionId={collectionId} sequenceId={sequenceId} />
  );
}
