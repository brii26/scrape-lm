import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params

  if (!id) redirect("/")

  // articles open directly via their URL (stored in NewsCard as href)
  // this page is a fallback for direct /news/[id] navigation
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-gray-500 text-sm">Redirecting to article...</p>
    </div>
  )
}
