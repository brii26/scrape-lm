"use client"

import { useFormStatus } from "react-dom"
import { ReactNode } from "react"

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
      {pending ? (
        <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : children}
    </button>
  )
}
