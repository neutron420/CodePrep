"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4.5 text-emerald-600 shrink-0" />
        ),
        info: (
          <InfoIcon className="size-4.5 text-blue-600 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4.5 text-amber-600 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="size-4.5 text-rose-600 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="size-4.5 animate-spin text-primary shrink-0" />
        ),
      }}
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#09090b",
          border: "1px solid #e4e4e7",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
          borderRadius: "14px",
          padding: "14px 16px",
        },
        classNames: {
          toast: "!bg-white !text-zinc-950 !border-zinc-200 shadow-xl",
          title: "font-semibold text-xs text-zinc-950",
          description: "text-zinc-600 text-[11px] mt-0.5 leading-relaxed",
          actionButton: "bg-zinc-900 text-white font-medium text-xs rounded-lg px-3 py-1",
          cancelButton: "bg-zinc-100 text-zinc-700 font-medium text-xs rounded-lg px-3 py-1",
          success: "!bg-white !text-zinc-950 !border-zinc-200",
          error: "!bg-white !text-zinc-950 !border-rose-200",
          warning: "!bg-white !text-zinc-950 !border-amber-200",
          info: "!bg-white !text-zinc-950 !border-blue-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
