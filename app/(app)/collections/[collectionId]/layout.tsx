import {
  type CollectionAcl,
  CollectionAclProvider,
} from "@/lib/contexts/collection-acl";
import { getSupabase } from "@/lib/supabase";

export default async function CollectionLayout({
  params,
  children,
}: {
  params: Promise<{ collectionId: string }>;
  children: React.ReactNode;
}) {
  const { collectionId } = await params;
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: collection } = await supabase
    .from("collections")
    .select("user_id")
    .eq("id", collectionId)
    .single();

  const acl: CollectionAcl = {
    canEdit: !!user && user.id === collection?.user_id,
  };

  return <CollectionAclProvider value={acl}>{children}</CollectionAclProvider>;
}
