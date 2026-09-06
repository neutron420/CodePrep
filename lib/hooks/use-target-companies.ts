"use client";

import { useSyncExternalStore, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/auth-context";

const STORAGE_KEY = "codecraft_target_companies";
const EVENT_NAME = "codecraft_targets_updated";

const DEFAULT_TARGETS: readonly string[] = [];

let memoryCache: readonly string[] = DEFAULT_TARGETS;
let cachedRaw: string | null = null;
let currentSyncedUid: string | null = null;

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

function updateLocalTargets(newTargets: readonly string[]) {
  try {
    const nextJson = JSON.stringify(newTargets);
    localStorage.setItem(STORAGE_KEY, nextJson);
    cachedRaw = nextJson;
    memoryCache = newTargets;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(EVENT_NAME));
    }
  } catch (err) {
    console.error("Failed to save target company to localStorage:", err);
  }
}

function getServerSnapshot(): readonly string[] {
  return DEFAULT_TARGETS;
}

export function useTargetCompanies() {
  const { user } = useAuth();
  const targets = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Whenever a logged-in user is detected, sync targets from the cloud
  useEffect(() => {
    if (!user?.uid) {
      currentSyncedUid = null;
      return;
    }

    if (currentSyncedUid === user.uid) return;
    currentSyncedUid = user.uid;

    async function loadCloudTargets() {
      try {
        const res = await fetch(`/api/user/targets?userId=${user?.uid}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.targets)) {
          if (data.targets.length > 0) {
            // User has cloud targets - update local device to match cloud
            updateLocalTargets(data.targets);
          } else {
            // User has no cloud targets yet in DB; migrate local targets to cloud
            const localTargets = Array.from(getSnapshot());
            if (localTargets.length > 0) {
              const syncRes = await fetch("/api/user/targets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user?.uid,
                  action: "sync",
                  targets: localTargets,
                }),
              });
              const syncData = await syncRes.json();
              if (syncData.success && Array.isArray(syncData.targets)) {
                updateLocalTargets(syncData.targets);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to sync cloud targets:", err);
      }
    }

    loadCloudTargets();
  }, [user?.uid]);

  const toggleTarget = useCallback(
    async (slug: string) => {
      const norm = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      const current = Array.from(getSnapshot());
      const next = current.includes(norm)
        ? current.filter((s) => s !== norm)
        : [norm, ...current];

      // 1. Optimistically update local state immediately
      updateLocalTargets(next);

      // 2. If logged in, update database in the cloud
      const currentUser = userRef.current;
      if (currentUser?.uid) {
        try {
          const res = await fetch("/api/user/targets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.uid,
              slug: norm,
            }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.targets)) {
            updateLocalTargets(data.targets);
          }
        } catch (err) {
          console.error("Failed to sync target toggle with cloud:", err);
        }
      }
    },
    []
  );

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
