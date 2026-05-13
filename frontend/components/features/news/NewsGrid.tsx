import type { NewsItem } from "@/lib/types"
import NewsCard from "./NewsCard"

interface Props {
  items: NewsItem[]
}

export default function NewsGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}
