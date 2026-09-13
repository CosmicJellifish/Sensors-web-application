"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { type ExportFilter, toSearchParams } from "../_lib/export-filter";

type ExportFilterValue = {
  /** What the operator has selected, including an edit the server has not rendered yet. */
  filter: ExportFilter;
  apply: (change: Partial<ExportFilter>) => void;
  isPending: boolean;
};

const ExportFilterContext = createContext<ExportFilterValue | null>(null);

export function useExportFilter(): ExportFilterValue {
  const value = useContext(ExportFilterContext);
  if (!value) {
    throw new Error("useExportFilter must be used inside ExportFilterProvider");
  }
  return value;
}

/**
 * Shares the selected filter between the parameters form and the download link,
 * which live in different halves of the page and so cannot pass it directly.
 *
 * The query string stays the source of truth, but writing to it costs a server
 * round-trip. While that is in flight the edit is held here, so a control — or
 * a Download click — that happens in the meantime already sees the new value
 * instead of the one the server last rendered. Once the transition settles the
 * server's filter takes over again, which also keeps Back/Forward honest.
 */
export function ExportFilterProvider({
  filter,
  children,
}: {
  filter: ExportFilter;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<ExportFilter | null>(null);

  const current = isPending && draft ? draft : filter;

  function apply(change: Partial<ExportFilter>) {
    const next = { ...current, ...change };
    const query = toSearchParams(next).toString();
    // Urgent, so the controls and the link update on this click; the navigation
    // below is what eventually re-renders the preview table on the server.
    setDraft(next);
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <ExportFilterContext.Provider value={{ filter: current, apply, isPending }}>
      {children}
    </ExportFilterContext.Provider>
  );
}
