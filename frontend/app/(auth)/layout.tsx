export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_center,_#0f172a_0%,_#030712_100%)]">
      {children}
    </div>
  )
}
