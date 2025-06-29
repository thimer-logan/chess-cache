import { Button } from "@/components/ui/button";
import VariationSelect from "./variation-select";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getSequenceWithVariations } from "@/lib/api/sequences";

export default async function Page({
  params,
}: {
  params: Promise<{ collectionId: string; sequenceId: string }>;
}) {
  const { collectionId, sequenceId } = await params;
  const sequence = await getSequenceWithVariations(sequenceId);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <VariationSelect
          collectionId={collectionId}
          sequenceId={sequenceId}
          variations={sequence.variations}
        />
        <Button asChild>
          <Link
            href={`/collections/${collectionId}/sequences/${sequenceId}/new`}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Variation
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Choose a variation or create a new one
      </p>
    </div>
  );
}
