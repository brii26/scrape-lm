import Footer from "@/components/layout/Footer"
import MainShell from "@/components/layout/MainShell"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_center,_#0f172a_0%,_#030712_100%)]">
      <MainShell>{children}</MainShell>
      <Footer />
    </div>
  )
}
