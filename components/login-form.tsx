"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { Check, Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    signInWithGoogle,
    signInWithGithub,
  } = useAuth();

  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setActiveProvider("google");
      setErrorMsg("");
      await signInWithGoogle(rememberMe);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Google sign-in was cancelled or failed. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveProvider(null);
    }
  };



  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setActiveProvider("github");
      setErrorMsg("");
      await signInWithGithub(rememberMe);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("GitHub sign-in was cancelled or failed. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveProvider(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Clean, sharp subtle border (low deep) with subtle rounded-md corners instead of heavy rounded-rectangle */}
      <Card className="rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm bg-card relative">
        <CardHeader className="text-center space-y-1 pb-3 pt-6 px-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Login with your Google or GitHub account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1 px-6 pb-6">
          {errorMsg && (
            <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Two Providers: Google, GitHub */}
          <div className="flex flex-col gap-2.5">
            {/* 1. Continue with Google */}
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 font-medium text-xs rounded-md shadow-2xs hover:bg-muted/60 transition-colors cursor-pointer h-11 border border-zinc-200 dark:border-zinc-800"
            >
              {activeProvider === "google" ? (
                <Loader2 className="size-4 animate-spin text-amber-500" />
              ) : (
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span className="font-medium text-xs">Continue with Google</span>
            </Button>



            {/* 2. Continue with GitHub */}
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 font-medium text-xs rounded-md shadow-2xs hover:bg-muted/60 transition-colors cursor-pointer h-11 border border-zinc-200 dark:border-zinc-800"
            >
              {activeProvider === "github" ? (
                <Loader2 className="size-4 animate-spin text-amber-500" />
              ) : (
                <svg className="size-4 fill-foreground shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span className="font-medium text-xs">Continue with GitHub</span>
            </Button>
          </div>

          {/* Remember Me for 7 Days Checkbox */}
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
            >
              <div
                className={`size-4 rounded border flex items-center justify-center transition-all ${
                  rememberMe
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950 font-bold"
                    : "border-zinc-300 dark:border-zinc-700 bg-background"
                }`}
              >
                {rememberMe && <Check className="size-3 stroke-[3]" />}
              </div>
              <span className="font-medium text-xs">
                Remember me for 7 days
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Privacy Description */}
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-foreground">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
