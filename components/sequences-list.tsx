import { SequenceWithVariations } from "@/lib/types/database.types";
import SequenceListItem from "./sequence-list-item";

export default function SequencesList({
  sequences,
}: {
  sequences: SequenceWithVariations[];
}) {
  return (
    <div className="flex flex-col">
      {sequences.map((sequence, index) => (
        <SequenceListItem
          key={sequence.id}
          sequence={sequence}
          className={
            index < sequences.length - 1 ? "border-b border-border" : ""
          }
        />
      ))}
    </div>
  );
}
