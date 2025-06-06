import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./ui/button";

export default function SubmitButton({
  isLoading,
  children,
  ...props
}: ButtonProps & {
  isLoading: boolean;
}) {
  return (
    <Button type="submit" disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
}
