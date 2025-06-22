"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotFound() {
  const { collectionId } = useParams<{ collectionId: string }>();

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <Image
        src="/images/rook_404.png"
        alt="Rook 404"
        width={300}
        height={300}
        className="mb-4"
      />
      <h2 className="text-2xl font-bold">Sequence Not Found</h2>
      <p className="text-muted-foreground">
        Could not find the requested sequence.
      </p>
      <Link
        href={`/collections/${collectionId}`}
        className="text-primary hover:underline"
      >
        Return to Collection
      </Link>
    </div>
  );
}
