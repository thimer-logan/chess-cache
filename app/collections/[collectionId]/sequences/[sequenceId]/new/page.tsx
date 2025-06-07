import NewVariationForm from "./new-variation-form";

export default async function NewVariationPage({
  params,
}: {
  params: Promise<{ sequenceId: string }>;
}) {
  const { sequenceId } = await params;

  return <NewVariationForm sequenceId={sequenceId} />;
}
