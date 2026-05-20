export default function NewsCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/8 w-full animate-pulse">
      <div className="relative h-44 bg-slate-800/80 w-full" />

      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 rounded-full bg-slate-700/80" />
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-3.5 w-full rounded-full bg-slate-700/80" />
          <div className="h-3.5 w-4/5 rounded-full bg-slate-700/80" />
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-2.5 w-full rounded-full bg-slate-800/80" />
          <div className="h-2.5 w-full rounded-full bg-slate-800/80" />
          <div className="h-2.5 w-3/5 rounded-full bg-slate-800/80" />
        </div>
      </div>
    </div>
  )
}
