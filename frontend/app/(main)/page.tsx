import PromptSection from "@/components/features/prompt/PromptSection"
import TextCursor from "@/components/ui/Cursor"

export default function HomePage() {
  return (
    <TextCursor spacing={50} maxPoints={9} exitDuration={0.5} randomFloat={true}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-50">What&apos;s on your mind?</h1>
        </div>
        <PromptSection />
      </div>
    </TextCursor>
  )
}
