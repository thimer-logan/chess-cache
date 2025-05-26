import { getSequenceWithVariations } from "@/lib/api/sequences";
import VariationSelect from "./variation-select";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

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
        <Button asChild>
          <Link href={`/sequences/${sequenceId}/new`}>
            <Plus className="h-4 w-4 mr-1" />
            New Variation
          </Link>
        </Button>
      </div>
      {children}
    </div>
  );
}
