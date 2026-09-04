"use client";

import { useState, useCallback } from "react";

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

export function useSolvedProblems() {
  const [solvedIds, setSolvedIds] = useState<Set<number>>(getInitialSolvedIds);

  const toggleSolved = useCallback((problemId: number) => {
    setSolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error("Failed to save solved problem to localStorage", e);
      }
      return next;
    });
  }, []);

  const isSolved = useCallback((problemId: number) => solvedIds.has(problemId), [solvedIds]);

  return {
    solvedIds,
    toggleSolved,
    isSolved,
    isLoaded: true,
  };
}
