import {
    IconArrowDown,
    IconSend,
} from '@tabler/icons-react';
import {
    KeyboardEvent,
    MutableRefObject,
    useEffect,
    useState,
} from 'react';

import { Message } from '@/types/chat';

interface Props {
    input: string;
    handleInputChange: any;
    handleSubmit: any;
    onScrollDownClick: () => void;
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
    showScrollDownButton: boolean;
}

export const ChatInput = ({
    input,
    handleInputChange,
    handleSubmit,
    onScrollDownClick,
    textareaRef,
    showScrollDownButton,
}: Props) => {
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const isMobile = () => {
        const userAgent =
            typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
        const mobileRegex =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        return mobileRegex.test(userAgent);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
            textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
                }`;
        }
    }, [input]);

    return (
        <div className="custom-scrollbar absolute bottom-[50px] left-0 w-full border-transparent md:pt-2">
            <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">

                <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#282c32] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">
                    <div className="absolute left-0 bottom-14 rounded bg-white dark:bg-[#282c32]">

                    </div>
                    <textarea
                        ref={textareaRef}
                        className="custom-scrollbar m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-4 text-black dark:bg-transparent dark:text-white md:py-3 focus:outline-none"
                        style={{
                            resize: 'none',
                            bottom: `${textareaRef?.current?.scrollHeight}px`,
                            maxHeight: '400px',
                            overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400
                                ? 'auto'
                                : 'hidden'
                                }`,
                        }}
                        placeholder="Type a message here."
                        value={input}
                        rows={1}
                        onCompositionStart={() => setIsTyping(true)}
                        onCompositionEnd={() => setIsTyping(false)}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        className="absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
                        onClick={handleSubmit}
                    >
                        <IconSend size={18} />
                    </button>

                    {showScrollDownButton && (
                        <div className="absolute bottom-12 right-0 lg:bottom-0 lg:-right-10">
                            <button
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
                                onClick={onScrollDownClick}
                            >
                                <IconArrowDown size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

