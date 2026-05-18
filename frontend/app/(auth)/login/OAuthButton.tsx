"use client"

import { useFormStatus } from "react-dom"
import { ReactNode } from "react"
import Spinner from "@/components/ui/Spinner"

interface Props {
  children: ReactNode
}

export default function OAuthButton({ children }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-200 transition-colors"
    >
      {pending ? <Spinner /> : children}
    </button>
  )
}
