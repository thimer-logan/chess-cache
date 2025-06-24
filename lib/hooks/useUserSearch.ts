"use client";

import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { type Profile } from "../types/database.types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUserSearch() {
  const [query, setQuery] = useState("");
  const setDebounced = useDebouncedCallback(setQuery, 250);

  const shouldSearch = query.length >= 2;
  const { data, isLoading } = useSWR<Profile[]>(
    shouldSearch ? `/api/user/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    { keepPreviousData: true, dedupingInterval: 10_000 }
  );

  const results = shouldSearch ? data ?? [] : [];

  return { results, loading: isLoading, setQuery: setDebounced };
}
