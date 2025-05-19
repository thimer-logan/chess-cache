import { getCategoriesWithSequences } from "@/lib/api/categories";
import CategoriesCard from "@/components/categories-card";

export default async function HomePage() {
  const categories = await getCategoriesWithSequences();

  return <CategoriesCard categories={categories} />;
}
