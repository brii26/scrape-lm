import PromptSection from "@/components/features/prompt/PromptSection"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">scrape-lm</h1>
        <p className="text-gray-500 text-sm mt-2">Search the news in plain English</p>
      </div>
      <PromptSection />
    </div>
  )
}
