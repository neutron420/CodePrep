"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/auth-context";

const STORAGE_KEY = "kodeprep_solved_problems";

function getInitialSolvedIds(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (e) {
    console.error("Failed to load solved problems from localStorage", e);
  }
  return new Set();
}

function saveLocalSolved(ids: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error("Failed to save solved problem to localStorage", e);
  }
}

let currentSolvedUid: string | null = null;

export function useSolvedProblems() {
  const { user } = useAuth();
  const [solvedIds, setSolvedIds] = useState<Set<number>>(getInitialSolvedIds);
  const userRef = useRef(user);
  userRef.current = user;

  // Sync with cloud on login
  useEffect(() => {
    if (!user?.uid) {
      currentSolvedUid = null;
      return;
    }

    if (currentSolvedUid === user.uid) return;
    currentSolvedUid = user.uid;

    async function loadCloudSolved() {
      try {
        const res = await fetch(`/api/user/solved?userId=${user?.uid}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.solvedIds)) {
          if (data.solvedIds.length > 0) {
            const cloudSet = new Set<number>(data.solvedIds);
            setSolvedIds(cloudSet);
            saveLocalSolved(cloudSet);
          } else {
            // Push local solved to cloud if any
            const localArr = Array.from(getInitialSolvedIds());
            if (localArr.length > 0) {
              const syncRes = await fetch("/api/user/solved", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user?.uid,
                  action: "sync",
                  solvedIds: localArr,
                }),
              });
              const syncData = await syncRes.json();
              if (syncData.success && Array.isArray(syncData.solvedIds)) {
                const merged = new Set<number>(syncData.solvedIds);
                setSolvedIds(merged);
                saveLocalSolved(merged);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to sync solved problems with cloud:", err);
      }
    }

    loadCloudSolved();
  }, [user?.uid]);

  const toggleSolved = useCallback(
    async (problemId: number) => {
      setSolvedIds((prev) => {
        const next = new Set(prev);
        if (next.has(problemId)) {
          next.delete(problemId);
        } else {
          next.add(problemId);
        }
        saveLocalSolved(next);
        return next;
      });

      const currentUser = userRef.current;
      if (currentUser?.uid) {
        try {
          const res = await fetch("/api/user/solved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.uid,
              problemId,
            }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.solvedIds)) {
            const updated = new Set<number>(data.solvedIds);
            setSolvedIds(updated);
            saveLocalSolved(updated);
          }
        } catch (err) {
          console.error("Failed to sync solved problem with cloud:", err);
        }
      }
    },
    []
  );

  const isSolved = useCallback((problemId: number) => solvedIds.has(problemId), [solvedIds]);

  return {
    solvedIds,
    toggleSolved,
    isSolved,
    isLoaded: true,
  };
}
