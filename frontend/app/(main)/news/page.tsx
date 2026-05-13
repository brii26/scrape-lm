import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { fetchNews } from "@/lib/api"
import { ScrapeQuerySchema } from "@/lib/validations"
import NewsGrid from "@/components/features/news/NewsGrid"
import EmptyState from "@/components/features/news/EmptyState"
import PaginationWrapper from "@/components/features/news/PaginationWrapper"

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function NewsPage({ searchParams }: Props) {
  const { q, page } = await searchParams

  if (!q) redirect("/")

  let query
  try {
    query = ScrapeQuerySchema.parse(JSON.parse(q))
  } catch {
    redirect("/")
  }

  const currentPage = Number(page ?? 1)
  query.filters.page = currentPage

  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) redirect("/api/auth/signin")

  const res = await fetchNews(query, token)
  const items = res.data?.news ?? []

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-gray-500">
        {items.length} results for <span className="font-medium text-gray-800">{query.topic}</span>
      </p>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <NewsGrid items={items} />
      )}
      {items.length > 0 && (
        <PaginationWrapper currentPage={currentPage} />
      )}
    </div>
  )
}
