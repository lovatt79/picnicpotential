"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SaveStatus } from "./types";

export function useAutosave(tableName: string) {
  const supabase = createClient();
  const pendingChanges = useRef<Map<string, Record<string, any>>>(new Map());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [saveStatus, setSaveStatus] = useState<Map<string, SaveStatus>>(
    new Map()
  );

  const flush = useCallback(
    async (itemId: string) => {
      const data = pendingChanges.current.get(itemId);
      if (!data) return;
      pendingChanges.current.delete(itemId);
      timers.current.delete(itemId);

      setSaveStatus((prev) => new Map(prev).set(itemId, "saving"));

      const { error } = await supabase
        .from(tableName)
        .update(data)
        .eq("id", itemId);

      setSaveStatus((prev) => new Map(prev).set(itemId, error ? "error" : "saved"));

      if (!error) {
        setTimeout(() => {
          setSaveStatus((prev) => {
            const next = new Map(prev);
            if (next.get(itemId) === "saved") next.delete(itemId);
            return next;
          });
        }, 2000);
      }
    },
    [supabase, tableName]
  );

  const saveField = useCallback(
    (itemId: string, changes: Record<string, any>) => {
      const existing = pendingChanges.current.get(itemId) || {};
      pendingChanges.current.set(itemId, { ...existing, ...changes });

      if (timers.current.has(itemId)) {
        clearTimeout(timers.current.get(itemId)!);
      }

      timers.current.set(itemId, setTimeout(() => flush(itemId), 800));
    },
    [flush]
  );

  const saveImmediate = useCallback(
    (itemId: string, changes: Record<string, any>) => {
      const existing = pendingChanges.current.get(itemId) || {};
      pendingChanges.current.set(itemId, { ...existing, ...changes });

      if (timers.current.has(itemId)) {
        clearTimeout(timers.current.get(itemId)!);
        timers.current.delete(itemId);
      }

      flush(itemId);
    },
    [flush]
  );

  const flushAll = useCallback(async () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();

    const promises: Promise<void>[] = [];
    pendingChanges.current.forEach((_, itemId) => {
      promises.push(flush(itemId));
    });
    await Promise.all(promises);
  }, [flush]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      // Fire-and-forget any pending saves
      pendingChanges.current.forEach((data, itemId) => {
        supabase.from(tableName).update(data).eq("id", itemId);
      });
    };
  }, [supabase, tableName]);

  return { saveField, saveImmediate, flushAll, saveStatus };
}
