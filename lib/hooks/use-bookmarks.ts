"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "sonner";

const STORAGE_KEY = "codecraft_bookmarked_problems";

function getLocalBookmarks(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {
    // Ignore error
  }
  return new Set();
}

function saveLocalBookmarks(ids: Set<number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Ignore error
  }
}

let activeBookmarkUid: string | null = null;

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(getLocalBookmarks);
  const [isLoading, setIsLoading] = useState(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Load from database on user sign-in & sync
  useEffect(() => {
    if (!user?.uid) {
      activeBookmarkUid = null;
      return;
    }

    if (activeBookmarkUid === user.uid) return;
    activeBookmarkUid = user.uid;

    async function loadDatabaseBookmarks() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user/bookmarks?userId=${user?.uid}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.bookmarkedIds)) {
            const dbSet = new Set<number>(data.bookmarkedIds);
            setBookmarkedIds(dbSet);
            saveLocalBookmarks(dbSet);
          }
        }
      } catch (err) {
        console.error("Failed to load bookmarks from database:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDatabaseBookmarks();
  }, [user?.uid]);

  const toggleBookmark = useCallback(
    async (problemId: number, problemTitle?: string) => {
      const currentUser = userRef.current;

      // Optimistic update
      let willBeBookmarked = false;
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(problemId)) {
          next.delete(problemId);
          willBeBookmarked = false;
        } else {
          next.add(problemId);
          willBeBookmarked = true;
        }
        saveLocalBookmarks(next);
        return next;
      });

      if (willBeBookmarked) {
        toast.success(problemTitle ? `Saved "${problemTitle}"` : "Question saved to bookmarks!");
      } else {
        toast.info("Removed from bookmarks");
      }

      // If user is logged in, sync directly with Neon PostgreSQL database
      if (currentUser?.uid) {
        try {
          const res = await fetch("/api/user/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.uid,
              problemId,
            }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.bookmarkedIds)) {
            const updated = new Set<number>(data.bookmarkedIds);
            setBookmarkedIds(updated);
            saveLocalBookmarks(updated);
          }
        } catch (err) {
          console.error("Failed to persist bookmark to database:", err);
          toast.error("Failed to save to cloud database");
        }
      } else {
        toast.info("Sign in to sync saved questions across devices & cloud database!");
      }
    },
    []
  );

  const isBookmarked = useCallback(
    (problemId: number) => bookmarkedIds.has(problemId),
    [bookmarkedIds]
  );

  return {
    bookmarkedIds,
    toggleBookmark,
    isBookmarked,
    isLoading,
    count: bookmarkedIds.size,
  };
}
