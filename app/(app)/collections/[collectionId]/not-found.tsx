import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <Image
        src="/images/rook_404.png"
        alt="Rook 404"
        width={300}
        height={300}
        className="mb-4"
      />
      <h2 className="text-2xl font-bold">Collection Not Found</h2>
      <p className="text-muted-foreground">
        Could not find the requested collection.
      </p>
      <Link href="/collections" className="text-primary hover:underline">
        Return to Collections
      </Link>
    </div>
  );
}
