import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/google-search/ui/sheet'
import { Button } from '@/components/google-search/ui/button'
import { ChevronLeft, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import HistoryItem from './history-item'
import { Chat } from '@/lib/types'
import { History as HistoryIcon } from 'lucide-react'

type HistoryProps = {
  location: 'sidebar' | 'header'
  chats: Chat[]
}

export function History({ location, chats }: HistoryProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn({
            'rounded-full text-foreground/30 dark:bg-[#2b3444] hover:dark:bg-[#282c32]': location === 'sidebar'
          })}
        >
          {location === 'header' ? <Menu /> : <ChevronLeft size={26} />}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64 dark:bg-[#2b3444] border-none">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1 text-sm font-normal mb-2">
            <HistoryIcon size={14} />
            History
          </SheetTitle>
        </SheetHeader>
        <div className="pb-6 overflow-y-auto h-full">
          {!chats?.length ? (
            <div className="text-foreground/30 text-sm text-center py-4">
              No history yet
            </div>
          ) : (
            chats?.map((chat: Chat) => (
              <HistoryItem key={chat.id} chat={chat} />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
