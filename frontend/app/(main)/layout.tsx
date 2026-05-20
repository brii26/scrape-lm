import Footer from "@/components/layout/Footer"
import MainShell from "@/components/layout/MainShell"

async function getSuggestions(): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/suggestions`, {
      cache: "no-store",
    })
    const data = await res.json()
    return data.suggestions ?? []
  } catch {
    return []
  }
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const suggestions = await getSuggestions()

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_center,_#0f172a_0%,_#030712_100%)]">
      <MainShell suggestions={suggestions}>{children}</MainShell>
      <Footer />
    </div>
  )
}
