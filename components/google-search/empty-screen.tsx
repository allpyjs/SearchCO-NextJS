import { Button } from '@/components/google-search/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'What is Artificial Intelligence?',
    message: 'What is Artificial Intelligence?'
  },
  {
    heading: "What is Microsoft's AI powered PCs?",
    message: "What is Microsoft's AI powered PCs?"
  },
  {
    heading: "What is Large Language Model?",
    message: "What is Large Language Model?"
  },
  {
    heading: "What is GPT-4o?",
    message: "What is GPT-4o?",
  },
  {
    heading: "How to create a business plan for a startup?",
    message: "How to create a business plan for a startup?",
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base text-black dark:text-white"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
