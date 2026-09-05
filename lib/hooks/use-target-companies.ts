"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "codecraft_target_companies";
const EVENT_NAME = "codecraft_targets_updated";

const DEFAULT_TARGETS: readonly string[] = ["google", "meta", "zeta"];

let memoryCache: readonly string[] = DEFAULT_TARGETS;
let cachedRaw: string | null = null;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): readonly string[] {
  if (typeof window === "undefined") return DEFAULT_TARGETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          memoryCache = parsed;
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TARGETS));
        memoryCache = DEFAULT_TARGETS;
      }
    }
  } catch (err) {
    console.error("Failed to read target companies from localStorage:", err);
  }
  return memoryCache;
}

function getServerSnapshot(): readonly string[] {
  return DEFAULT_TARGETS;
}

export function useTargetCompanies() {
  const targets = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTarget = useCallback((slug: string) => {
    const norm = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const current = Array.from(getSnapshot());
    const next = current.includes(norm)
      ? current.filter((s) => s !== norm)
      : [norm, ...current];

    try {
      const nextJson = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, nextJson);
      cachedRaw = nextJson;
      memoryCache = next;
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (err) {
      console.error("Failed to save target company to localStorage:", err);
    }
  }, []);

  const isTarget = useCallback(
    (slug: string) => {
      const norm = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      return targets.includes(norm);
    },
    [targets]
  );

  return {
    targets: targets as string[],
    isTarget,
    toggleTarget,
  };
}
