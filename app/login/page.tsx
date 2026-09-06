"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { LoginForm } from "@/components/login-form";
import { KodePrepLogo } from "@/components/kodeprep-logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="size-7 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 relative overflow-hidden">
      {/* Ambient warm orange theme glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[450px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Back to Home Navigation */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/60 z-10"
      >
        <ArrowLeft className="size-4 text-amber-500" />
        <span>Back to Home</span>
      </Link>

      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
        {/* Brand Logo at the top */}
        <div className="flex justify-center items-center">
          <KodePrepLogo imageClassName="h-9 sm:h-10" />
        </div>

        {/* Customized Orange-Themed Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
