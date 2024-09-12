import { FC, useEffect, useRef, useState } from 'react';
import { Oval } from 'react-loader-spinner'
import styles from "@/components/assistant/file-viewer.module.css";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    id: string;
}

const Dialog: FC<DialogProps> = ({ open, onClose, id }) => {
    const [copied1, setCopied1] = useState(false);
    const [copied2, setCopied2] = useState(false);
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

    const codeString1 = `<iframe
    src="https://search.co/website-integration/chatbot-iframe/${id.slice(5)}"
    title="Chatbot"
    width="100%"
    style="height: 100%; min-height: 700px"
    frameborder="0">
</iframe>`;

    const codeString2 = `<script>
    window.embeddedChatbotConfig = {
        chatbotId: "${id.slice(5)}",
        domain: ""
    }
</script>
<script
    src="https://search.co/embed.min.js"
    chatbotId="${id.slice(5)}"
    defer>
</script>`;

    const handleCopy1 = () => {
        navigator.clipboard.writeText(codeString1)
            .then(() => {
                setCopied1(true);
                setTimeout(() => setCopied1(false), 3000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                setCopied1(false);
            });
    };

    const handleCopy2 = () => {
        navigator.clipboard.writeText(codeString2)
            .then(() => {
                setCopied2(true);
                setTimeout(() => setCopied2(false), 3000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                setCopied2(false);
            });
    };

    return (
        <>
            {open && (
                <div
                    className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="fixed inset-0 z-10 overflow-hidden">
                        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                                aria-hidden="true"
                            />

                            <div
                                ref={modalRef}
                                className="dark:border-netural-400 inline-block max-h-[700px] transform overflow-y-auto rounded-lg border border-gray-700  bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[800px] w-full sm:max-w-[700px] sm:p-6 sm:align-middle"
                                role="dialog"
                                style={{ zIndex: 1000 }}
                            >
                                <div className="relative m-auto grid w-full" role="region" aria-roledescription="carousel">
                                    <div className="overflow-hidden">
                                        <div className="flex -ml-4">
                                            <div role="group" aria-roledescription="slide" className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                                                <div className="z-50 cursor-text ">
                                                    <div className="sm:flex sm:items-start">
                                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                            <h2 id="radix-:rv:"
                                                                className="tracking-tight flex w-full justify-evenly text-lg font-medium leading-6 text-zinc-900 dark:text-white">
                                                                <span className="w-full text-center text-[30px] mb-[15px]">search.co</span></h2>
                                                            <div className="mt-2">
                                                                <p className="text-sm text-zinc-500">To add the chatbot any where on your website, add this
                                                                    iframe to your html code</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                        <pre className=" w-full overflow-auto rounded bg-zinc-100 p-2 text-xs dark:bg-[#121723]"><code>
                                                            {codeString1}
                                                        </code></pre>
                                                    </div>
                                                    <div className="mt-3 flex justify-center">
                                                        <button
                                                            onClick={handleCopy1}
                                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 px-4 py-1">Copy
                                                            Iframe <span className="ml-2">
                                                                {copied1 ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                                        strokeLinecap="round" strokeLinejoin="round"
                                                                        className="lucide lucide-check h-4 w-4">
                                                                        <path d="M20 6L9 17l-5-5"></path>
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                                        strokeLinecap="round" strokeLinejoin="round"
                                                                        className="lucide lucide-clipboard h-4 w-4">
                                                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                                                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2">
                                                                        </path>
                                                                    </svg>
                                                                )}</span></button></div>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-zinc-500">To add a chat bubble to the bottom right of your website add
                                                            this script tag to your html</p>
                                                    </div>
                                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                        <pre className=" w-full overflow-auto rounded bg-zinc-100 p-2 text-xs dark:bg-[#121723]"><code>
                                                            {codeString2}
                                                        </code>
                                                        </pre>
                                                    </div>
                                                    <div className="mt-3 flex justify-center">
                                                        <button
                                                            onClick={handleCopy2}
                                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 px-4 py-1">Copy
                                                            Script
                                                            <span className="ml-2">{copied2 ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                                    strokeLinecap="round" strokeLinejoin="round"
                                                                    className="lucide lucide-check h-4 w-4">
                                                                    <path d="M20 6L9 17l-5-5"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                                    strokeLinecap="round" strokeLinejoin="round"
                                                                    className="lucide lucide-clipboard h-4 w-4">
                                                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                                                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2">
                                                                    </path>
                                                                </svg>
                                                            )}</span>
                                                        </button></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dialog;

