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
      className="flex flex-col rounded-2xl overflow-hidden bg-[#161b2e] border border-white/8 hover:border-white/20 transition-colors"
    >
      <div className="relative h-44 bg-[#1a2236]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a2236] to-[#0d1117]" />
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
          {item.source}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <p className="text-xs text-slate-500">
          {item.published_at}
          {item.region && <span className="ml-2 capitalize">{item.region}</span>}
        </p>
        <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug">
          {item.title}
        </h3>
        {item.summary && (
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {item.summary}
          </p>
        )}
      </div>
    </a>
  )
}
