import { getSequenceWithVariations } from "@/lib/api/sequences";
import VariationSelect from "./variation-select";
import type { ReactNode } from "react";
import NewVariationDialog from "./new-variation-dialog";

export default async function SequenceLayout({
  params,
  children,
}: {
  params: Promise<{ sequenceId: string }>;
  children: ReactNode;
}) {
  const { sequenceId } = await params;
  const sequence = await getSequenceWithVariations(sequenceId);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-bold">{sequence.name}</h1>
      <div className="flex justify-between items-center">
        <VariationSelect
          sequenceId={sequenceId}
          variations={sequence.variations}
        />
        <NewVariationDialog sequenceId={sequence.id} />
      </div>
      {children}
    </div>
  );
}
