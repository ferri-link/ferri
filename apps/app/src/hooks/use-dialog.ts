"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { useCallback } from "react";

// Every dialog is addressable via the URL. `?dialog=<name>` opens a dialog;
// dialogs that act on a specific entity (edit/delete) also carry `?id=<entityId>`
// so the right instance opens and the URL is shareable.
const dialogParsers = {
  dialog: parseAsString,
  id: parseAsString,
};

/**
 * Drives a dialog's open state from the search query. Returns the familiar
 * `[open, setOpen]` tuple so it drops in wherever `useState(false)` was used.
 *
 * Pass an `id` for per-entity dialogs — the dialog is only open when both the
 * name and the id in the URL match, and closing clears both params.
 */
export function useDialogParam(name: string, id?: string) {
  const [{ dialog, id: activeId }, setParams] = useQueryStates(dialogParsers);

  const open = dialog === name && (id === undefined || activeId === id);

  const setOpen = useCallback(
    (next: boolean) =>
      void setParams(
        next ? { dialog: name, id: id ?? null } : { dialog: null, id: null },
      ),
    [name, id, setParams],
  );

  return [open, setOpen] as const;
}
