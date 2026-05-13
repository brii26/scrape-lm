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
      className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}
      <span className="text-xs text-blue-600 font-medium">{item.source}</span>
      <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{item.title}</h3>
      {item.summary && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.summary}</p>
      )}
      <p className="text-xs text-gray-400 mt-2">{item.published_at}</p>
    </a>
  )
}
