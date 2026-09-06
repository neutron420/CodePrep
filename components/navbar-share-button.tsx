"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Optimize dashboard performance: Dynamically import SubmitQuestionDialog on-demand
const SubmitQuestionDialog = dynamic(
  () => import("@/components/submit-question-dialog").then((mod) => mod.SubmitQuestionDialog),
  { ssr: false }
);

interface NavbarShareButtonProps {
  companySlug?: string;
  companyName?: string;
}

export function NavbarShareButton({ companySlug, companyName }: NavbarShareButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 font-medium cursor-pointer shadow-2xs text-xs h-8 px-2 sm:px-3 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
        title="Share an interview question asked recently"
      >
        <Plus className="size-3.5 shrink-0" />
        <span className="hidden sm:inline">Share Question</span>
        <span className="hidden xs:inline sm:hidden">Share</span>
      </Button>

      {open && (
        <SubmitQuestionDialog
          open={open}
          onOpenChange={setOpen}
          companySlug={companySlug}
          companyName={companyName}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </>
  );
}
