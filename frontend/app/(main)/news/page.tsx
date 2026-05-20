import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { fetchNews } from "@/lib/api"
import { ScrapeQuerySchema } from "@/lib/validations"
import NewsGrid from "@/components/features/news/NewsGrid"
import EmptyState from "@/components/features/news/EmptyState"
import PaginationWrapper from "@/components/features/news/PaginationWrapper"
import PromptSection from "@/components/features/prompt/PromptSection"

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
  const total = res.data?.total ?? 0
  const totalPages = Math.ceil(total / 6)

  return (
    <>
      <PromptSection floating />
      <div className="flex flex-col gap-6 pb-24">
        <p className="text-sm text-slate-500">
          {total} results for relevant news
        </p>
        {items.length === 0 ? <EmptyState /> : <NewsGrid items={items} />}
        {items.length > 0 && <PaginationWrapper currentPage={currentPage} totalPages={totalPages} />}
      </div>
    </>
  )
}
