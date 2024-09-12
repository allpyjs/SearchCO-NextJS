import { notFound, redirect } from 'next/navigation'
import { Chat } from '@/components/google-search/chat'
import { getChat } from '@/lib/actions/chat'
import { AI } from '@/app/actions'

export const runtime = 'edge'

export interface SearchPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SearchPageProps) {
  const chat = await getChat(params.id, 'anonymous')
  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SearchPage({ params }: SearchPageProps) {
  const userId = 'anonymous'
  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/')
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages, userId: "ananymous" }}>
      <Chat id={params.id} />
    </AI>
  )
}
