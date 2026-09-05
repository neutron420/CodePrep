"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  ConfirmationResult,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (rememberMe?: boolean) => Promise<void>;
  signInWithGithub: (rememberMe?: boolean) => Promise<void>;
  signInWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendPhoneOtp: (phoneNumber: string, containerId: string) => Promise<boolean>;
  verifyPhoneOtp: (otp: string, rememberMe?: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  hasConfirmationPending: boolean;
  lastUsedProvider: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REMEMBER_KEY = "codecraft_remember_until";
const LAST_PROVIDER_KEY = "codecraft_last_auth_provider";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUsedProvider, setLastUsedProvider] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(LAST_PROVIDER_KEY) || "GOOGLE";
      } catch {
        return "GOOGLE";
      }
    }
    return "GOOGLE";
  });
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // Sync user profile to Neon PostgreSQL via /api/auth/sync
  const syncUserToDb = useCallback(async (u: User) => {
    try {
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: u.uid,
          email: u.email,
          phoneNumber: u.phoneNumber,
          displayName: u.displayName,
          photoUrl: u.photoURL,
        }),
      });
    } catch (err) {
      console.error("Failed to sync user to database:", err);
    }
  }, []);

  // Check 7-day remember-me expiration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rememberUntil = localStorage.getItem(REMEMBER_KEY);
      if (rememberUntil && Date.now() > Number(rememberUntil)) {
        // Expired after 7 days
        fbSignOut(auth).catch(console.error);
        localStorage.removeItem(REMEMBER_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        syncUserToDb(currentUser);
      }
    });

    return () => unsubscribe();
  }, [syncUserToDb]);

  const applyPersistence = async (rememberMe: boolean) => {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, String(Date.now() + SEVEN_DAYS_MS));
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch (err) {
      console.error("Failed to set auth persistence:", err);
    }
  };

  const signInWithGoogle = useCallback(
    async (rememberMe = true) => {
      await applyPersistence(rememberMe);
      localStorage.setItem(LAST_PROVIDER_KEY, "GOOGLE");
      setLastUsedProvider("GOOGLE");
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserToDb(res.user);
      }
    },
    [syncUserToDb]
  );

  const signInWithGithub = useCallback(
    async (rememberMe = true) => {
      await applyPersistence(rememberMe);
      localStorage.setItem(LAST_PROVIDER_KEY, "GITHUB");
      setLastUsedProvider("GITHUB");
      const res = await signInWithPopup(auth, githubProvider);
      if (res.user) {
        await syncUserToDb(res.user);
      }
    },
    [syncUserToDb]
  );



  const signInWithEmail = useCallback(
    async (email: string, pass: string, rememberMe = true) => {
      await applyPersistence(rememberMe);
      localStorage.setItem(LAST_PROVIDER_KEY, "EMAIL");
      setLastUsedProvider("EMAIL");
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await syncUserToDb(res.user);
      }
    },
    [syncUserToDb]
  );

  const signUpWithEmail = useCallback(
    async (email: string, pass: string, rememberMe = true) => {
      await applyPersistence(rememberMe);
      localStorage.setItem(LAST_PROVIDER_KEY, "EMAIL");
      setLastUsedProvider("EMAIL");
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await syncUserToDb(res.user);
      }
    },
    [syncUserToDb]
  );

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const sendPhoneOtp = useCallback(
    async (phoneNumber: string, containerId: string): Promise<boolean> => {
      try {
        const existingContainer = document.getElementById(containerId);
        if (existingContainer) {
          existingContainer.innerHTML = "";
        }

        const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {},
        });

        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(confirmation);
        return true;
      } catch (err) {
        console.error("Error sending phone OTP:", err);
        throw err;
      }
    },
    []
  );

  const verifyPhoneOtp = useCallback(
    async (otp: string, rememberMe = true): Promise<boolean> => {
      if (!confirmationResult) {
        throw new Error("No phone verification in progress. Please request an OTP first.");
      }
      try {
        await applyPersistence(rememberMe);
        localStorage.setItem(LAST_PROVIDER_KEY, "PHONE");
        setLastUsedProvider("PHONE");
        const res = await confirmationResult.confirm(otp);
        if (res.user) {
          await syncUserToDb(res.user);
        }
        setConfirmationResult(null);
        return true;
      } catch (err) {
        console.error("Error confirming OTP:", err);
        throw err;
      }
    },
    [confirmationResult, syncUserToDb]
  );

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
    localStorage.removeItem(REMEMBER_KEY);
    setConfirmationResult(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        sendPhoneOtp,
        verifyPhoneOtp,
        signOut,
        hasConfirmationPending: Boolean(confirmationResult),
        lastUsedProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
