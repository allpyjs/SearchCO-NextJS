import { Chat } from '@/components/google-search/chat'
import { nanoid } from 'ai'
import { AI } from '@/app/actions'
import Sidebar from '@/components/google-search/sidebar'

export const runtime = 'edge'

export default function GoogleSearchPage() {
    const id = nanoid()
    return (
        <div>
            <AI initialAIState={{ chatId: id, messages: [], userId: "anonymous" }}>
                <Chat id={id} />
            </AI>
            <Sidebar />
        </div>
    )
}
