"use client"
import {
    MutableRefObject,
    memo,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { throttle } from '@/utils/data/throttle';

import { ChatInput } from './ChatInput';
import HomeContext from '@/contexts/homeContext';
import { useChat } from 'ai/react';
import { ChatMessage } from './ChatMessage';

const options = {
    api: "/api/chatgpt/chat"
};

const MainBar = () => {
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat(options);

    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                chatContainerRef.current;
            const bottomTolerance = 30;

            if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
                setAutoScrollEnabled(false);
                setShowScrollDownButton(true);
            } else {
                setAutoScrollEnabled(true);
                setShowScrollDownButton(false);
            }
        }
    };

    const handleScrollDown = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const scrollDown = () => {
        if (autoScrollEnabled) {
            messagesEndRef.current?.scrollIntoView(true);
        }
    };
    const throttledScrollDown = throttle(scrollDown, 250);
    useEffect(() => {
        throttledScrollDown();
    }, [throttledScrollDown]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setAutoScrollEnabled(entry.isIntersecting);
                if (entry.isIntersecting) {
                    textareaRef.current?.focus();
                }
            },
            {
                root: null,
                threshold: 0.5,
            },
        );
        const messagesEndElement = messagesEndRef.current;
        if (messagesEndElement) {
            observer.observe(messagesEndElement);
        }
        return () => {
            if (messagesEndElement) {
                observer.unobserve(messagesEndElement);
            }
        };
    }, [messagesEndRef]);

    return (
        <div className='flex flex-1'>
            <div
                className="max-h-full overflow-x-hidden custom-scrollbar flex-1"
                ref={chatContainerRef}
                onScroll={handleScroll}
            >
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        messageIndex={index}
                        onEdit={(editedMessage) => {

                        }}
                    />
                ))}
                <div
                    className="h-[162px]"
                    ref={messagesEndRef}
                />
            </div>
            <ChatInput
                length={messages?.length || 0}
                isLoading={isLoading}
                textareaRef={textareaRef}
                input={input}
                handleInputChange={handleInputChange}
                messages={messages}
                onScrollDownClick={handleScrollDown}
                handleSubmit={handleSubmit}
                showScrollDownButton={showScrollDownButton}
            />
        </div>
    );
};

export default MainBar;