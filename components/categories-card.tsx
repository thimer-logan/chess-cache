import { CategoryWithSequences } from "@/lib/types/database.types";
import { CategoriesAccordian } from "@/components/categories-accordian";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import NewCategoryDialog from "@/app/new-category-dialog";

interface CategoriesCardProps {
  categories: CategoryWithSequences[];
  className?: string;
}

export default function CategoriesCard({
  categories,
  className,
}: CategoriesCardProps) {
  return (
    <Card className={cn("flex-1", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">Categories</CardTitle>
        <NewCategoryDialog />
      </CardHeader>
      <CardContent>
        <CategoriesAccordian categories={categories} />
      </CardContent>
    </Card>
  );
}
