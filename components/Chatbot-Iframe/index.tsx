"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import HomeContext from "@/contexts/homeContext";
import { BeatLoader } from "react-spinners";

type MessageProps = {
    role: "user" | "assistant" | "code";
    text: string;
};

const MessageBubble = ({ children, backgroundColor = '#f1f1f0', textColor = 'black', role = 'assistant', text = "" }) => (
    <>
        {role === "assistant" ?
            <div className="flex justify-start" >
                <div className="mb-3 max-w-prose overflow-auto rounded-lg px-4 py-3" style={{ backgroundColor: "#f1f1f0" }}>
                    <div className="flex flex-col items-start gap-4">
                        <div className="prose break-words text-left text-[#000000]">{children}</div>
                    </div>
                </div>
            </div> :
            <div className="flex justify-end" >
                <div className="mb-3 max-w-prose overflow-auto rounded-lg px-4 py-3" style={{ backgroundColor: "rgb(59, 129, 246)" }}>
                    <div className="flex flex-col items-start gap-4">
                        <div className="prose break-words text-left text-[#ffffff]">{text === "" ? children : <Markdown>{text}</Markdown>}</div>
                    </div>
                </div>
            </div>}
    </>
);

const Header = () => (
    <div className="z-10 flex justify-between border-b py-1 px-2 bg-[#4a6cf7] min-h-[50px] border-[#999999] shadow-lg" aria-label="Chatbot Header">
        <div className="flex items-center"></div>
        {/* <div className="flex items-center justify-center">
            <button
                className="inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80  h-9 px-0 py-3 text-sm transition-transform duration-700 ease-in-out hover:rotate-180"
                aria-label="Reset Chat" title="Reset Chat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div> */}
    </div>
);

type ChatbotIframePageProps = {
    functionCallHandler?: (
        toolCall: RequiredActionFunctionToolCall
    ) => Promise<string>;
    assistantId: string;
};


const ChatbotIframePage = ({
    functionCallHandler = () => Promise.resolve(""),
    assistantId
}: ChatbotIframePageProps) => {

    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([{
        role: "assistant",
        text: "Hello, how can I assist you today?"
    }]);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [threadId, setThreadId] = useState("");
    const [sending, setSending] = useState(false);
    const [store, setStore] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const {
        state: {
            isFullScreen
        },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        const createThread = async () => {
            const res = await fetch(`/api/assistants/threads`, {
                method: "POST",
            });
            const data = await res.json();
            setThreadId(data.threadId);
        };
        createThread();
    }, []);

    const sendMessage = async (text) => {
        const response = await fetch(
            `/api/assistants/threads/${threadId}/messages`,
            {
                method: "POST",
                body: JSON.stringify({
                    content: text,
                    assistantId
                }),
            }
        );
        const stream = AssistantStream.fromReadableStream(response.body);
        handleReadableStream(stream);
    };

    const submitActionResult = async (runId, toolCallOutputs) => {
        const response = await fetch(
            `/api/assistants/threads/${threadId}/actions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    runId: runId,
                    toolCallOutputs: toolCallOutputs,
                    assistantId
                }),
            }
        );
        const stream = AssistantStream.fromReadableStream(response.body);
        handleReadableStream(stream);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        sendMessage(userInput);
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", text: userInput },
        ]);
        setUserInput("");
        setInputDisabled(true);
        setSending(true);
        scrollToBottom();
    };

    /* Stream Event Handlers */

    // textCreated - create new assistant message
    const handleTextCreated = () => {
        appendMessage("assistant", "");
    };

    // textDelta - append text to last assistant message
    const handleTextDelta = (delta) => {
        if (delta.value != null) {
            setSending(false);
            appendToLastMessage(delta.value);
        };
        if (delta.annotations != null) {
            annotateLastMessage(delta.annotations);
        }
    };

    // imageFileDone - show image in chat
    const handleImageFileDone = (image) => {
        appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
    }

    // toolCallCreated - log new tool call
    const toolCallCreated = (toolCall) => {
        if (toolCall.type != "code_interpreter") return;
        appendMessage("code", "");
    };

    // toolCallDelta - log delta and snapshot for the tool call
    const toolCallDelta = (delta, snapshot) => {
        if (delta.type != "code_interpreter") return;
        if (!delta.code_interpreter.input) return;
        appendToLastMessage(delta.code_interpreter.input);
    };

    // handleRequiresAction - handle function call
    const handleRequiresAction = async (
        event: AssistantStreamEvent.ThreadRunRequiresAction
    ) => {
        const runId = event.data.id;
        const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
        // loop over tool calls and call function handler
        const toolCallOutputs = await Promise.all(
            toolCalls.map(async (toolCall) => {
                const result = await functionCallHandler(toolCall);
                return { output: result, tool_call_id: toolCall.id };
            })
        );
        setInputDisabled(true);
        setSending(true);
        submitActionResult(runId, toolCallOutputs);
    };

    // handleRunCompleted - re-enable the input form
    const handleRunCompleted = () => {
        setSending(false);
        setInputDisabled(false);
    };

    const handleReadableStream = (stream: AssistantStream) => {
        // messages
        stream.on("textCreated", handleTextCreated);
        stream.on("textDelta", handleTextDelta);

        // image
        stream.on("imageFileDone", handleImageFileDone);

        // code interpreter
        stream.on("toolCallCreated", toolCallCreated);
        stream.on("toolCallDelta", toolCallDelta);

        // events without helpers yet (e.g. requires_action and run.done)
        stream.on("event", (event) => {
            if (event.event === "thread.run.requires_action")
                handleRequiresAction(event);
            if (event.event === "thread.run.completed") handleRunCompleted();
        });
    };

    /*
      =======================
      === Utility Helpers ===
      =======================
    */

    const appendToLastMessage = (text) => {
        setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedLastMessage = {
                ...lastMessage,
                text: lastMessage.text + text,
            };
            return [...prevMessages.slice(0, -1), updatedLastMessage];
        });
    };

    const appendMessage = (role, text) => {
        setMessages((prevMessages) => [...prevMessages, { role, text }]);
    };

    const annotateLastMessage = (annotations) => {
        setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedLastMessage = {
                ...lastMessage,
            };
            annotations.forEach((annotation) => {
                if (annotation.type === 'file_path') {
                    updatedLastMessage.text = updatedLastMessage.text.replaceAll(
                        annotation.text,
                        `/api/files/${annotation.file_path.file_id}`
                    );
                }
            })
            return [...prevMessages.slice(0, -1), updatedLastMessage];
        });

    }

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
            textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
                }`;
        }
    }, [userInput]);

    return (
        <div className="h-screen max-h-[100vh] bg-[#ffffff]" title="Chatbot">
            <div className="flex h-full flex-col overflow-hidden">
                <Header />
                <div className="flex-grow overflow-auto my-[20px] w-full px-4">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} role={msg.role} text={msg.text} >
                            <p>{msg.text}</p>
                        </MessageBubble>
                    ))}
                    {sending && <MessageBubble role="assistant">
                        <div className="flex items-center">
                            <BeatLoader color="#888888" />
                        </div>
                    </MessageBubble>}
                </div>
                <div className="bg-inherit">
                    <form onSubmit={handleSubmit}
                    >
                        <div className="flex gap-2 overflow-x-auto p-3"></div>
                        <div className="flex border-t px-4 py-3 border-[#e4e4e7]">
                            <div className="flex w-full items-center leading-none">
                                <textarea
                                    ref={textareaRef}
                                    required
                                    maxLength={4000}
                                    rows={1}
                                    tabIndex={0}
                                    className="mr-3 message-scrollbar max-h-36 text-black w-full resize-none bg-transparent pr-3 leading-[24px] focus:outline-none focus:ring-0 focus-visible:ring-0 group-[.cb-dark]:text-white group-[.cb-light]:text-black"
                                    placeholder="Message..."
                                    aria-label="Write a Message"
                                    title="Write a Message"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    style={{
                                        resize: 'none',
                                        bottom: `${textareaRef?.current?.scrollHeight}px`,
                                        maxHeight: '200px',
                                        overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400
                                            ? 'auto'
                                            : 'hidden'
                                            }`,
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (userInput.trim() !== '') {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.form?.requestSubmit();
                                            }
                                        }
                                    }}
                                ></textarea>
                            </div>
                            <div className="flex items-end leading-none">
                                <button
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50 h-9 p-1 group-[.cb-dark]:text-zinc-300 group-[.cb-light]:text-zinc-700"
                                    type="submit"
                                    aria-label="Send Message"
                                    title="Send Message"
                                    disabled={userInput === ""}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#444444" aria-hidden="true" className="h-5 w-5">
                                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 px-4 pb-3 pt-1">
                            <p className="grow text-nowrap text-center text-xs group-[.cb-dark]:text-[#b4b4b5] group-[.cb-light]:text-[#3f3f46]">
                                Powed By Search.co <a target="_blank" className="ml-1 font-semibold group-[.cb-dark]:text-[#f1f1f0] group-[.cb-light]:text-[#141410]" href="https://search.co">Search.co</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatbotIframePage;
