"use client";

import React, { createContext, useContext } from "react";

export interface CollectionAcl {
  canEdit: boolean;
}

const CollectionAclCtx = createContext<CollectionAcl>({ canEdit: false });

export function CollectionAclProvider({
  value,
  children,
}: {
  value: CollectionAcl;
  children: React.ReactNode;
}) {
  return (
    <CollectionAclCtx.Provider value={value}>
      {children}
    </CollectionAclCtx.Provider>
  );
}

export const useCollectionAcl = () => useContext(CollectionAclCtx);

export function IfOwner({ children }: { children: React.ReactNode }) {
  const { canEdit } = useCollectionAcl();
  return canEdit ? <>{children}</> : null;
}
