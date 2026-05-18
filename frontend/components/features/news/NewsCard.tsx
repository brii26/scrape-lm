import type { NewsItem } from "@/lib/types"

interface Props {
  item: NewsItem
}

export default function NewsCard({ item }: Props) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/8 hover:border-sky-300/20 transition-colors"
    >
      <div className="relative h-44 bg-slate-900">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#030712]" />
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
          {item.source}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <p className="text-xs text-slate-400">
          {item.published_at}
          {item.region && <span className="ml-2 capitalize">{item.region}</span>}
        </p>
        <h3 className="text-sm font-semibold text-slate-50 line-clamp-2 leading-snug">
          {item.title}
        </h3>
        {item.summary && (
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{item.summary}</p>
        )}
      </div>
    </a>
  )
}
