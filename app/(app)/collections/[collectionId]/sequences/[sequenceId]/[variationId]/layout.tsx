import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateLineDialog from "./create-line-dialog";
import LineSelect from "./line-select";
import { getVariationWithLines } from "@/lib/api/variations";
import { notFound } from "next/navigation";
import { IfOwner } from "@/lib/contexts/collection-acl";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    collectionId: string;
    sequenceId: string;
    variationId: string;
  }>;
}) {
  const { variationId } = await params;
  const variation = await getVariationWithLines(variationId);

  if (!variation) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{variation.name}</h4>
        <div className="flex items-center gap-2">
          {variation.lines.length > 0 && <LineSelect lines={variation.lines} />}
          <IfOwner>
            <CreateLineDialog>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Line
              </Button>
            </CreateLineDialog>
          </IfOwner>
        </div>
      </div>
      {children}
    </div>
  );
}
