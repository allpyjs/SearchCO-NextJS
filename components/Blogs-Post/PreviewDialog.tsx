import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import { DateStore } from "@/types/datastore";
import { MemoizedReactMarkdown } from '../Blog/MemoizedReactMarkdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from '../Chatgpt/Markdown/CodeBlock';
import rehypeMathjax from 'rehype-mathjax';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    content: string;
}

const Dialog: FC<DialogProps> = ({ open, onClose, content }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener('mouseup', handleMouseUp);
            onClose();
        };

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [onClose]);


    return (
        <>
            {open && (
                <div
                    className="z-1000 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="fixed inset-0 z-10 overflow-hidden">
                        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                                aria-hidden="true"
                            />

                            <div
                                ref={modalRef}
                                className="custom-scrollbar dark:border-netural-400 inline-block max-h-[700px] min-h-[700px] transform overflow-y-auto rounded-lg border border-gray-700  bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[700px] w-full sm:max-w-[1000px] sm:min-w-[1000px] sm:p-6 sm:align-middle"
                                role="dialog"
                            >
                                <MemoizedReactMarkdown
                                    className="prose dark:prose-invert flex-1"
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeMathjax]}
                                    components={{
                                        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                                        code({ node, inline, className, children, ...props }) {
                                            if (children.length) {
                                                if (children[0] == '▍') {
                                                    return <span className="animate-pulse cursor-default mt-1">▍</span>
                                                }

                                                children[0] = (children[0] as string).replace("`▍`", "▍")
                                            }

                                            const match = /language-(\w+)/.exec(className || '');

                                            return !inline ? (
                                                <CodeBlock
                                                    key={Math.random()}
                                                    language={(match && match[1]) || ''}
                                                    value={String(children).replace(/\n$/, '')}
                                                    {...props}
                                                />
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        table({ children }) {
                                            return (
                                                <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                                                    {children}
                                                </table>
                                            );
                                        },
                                        th({ children }) {
                                            return (
                                                <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                                                    {children}
                                                </th>
                                            );
                                        },
                                        td({ children }) {
                                            return (
                                                <td className="break-words border border-black px-3 py-1 dark:border-white">
                                                    {children}
                                                </td>
                                            );
                                        },
                                    }}
                                >
                                    {content}
                                </MemoizedReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default Dialog;

