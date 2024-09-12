"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import styles1 from "@/app/assistant/examples/shared/page.module.css";
import styles from "@/components/assistant/chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import HomeContext from "@/contexts/homeContext";
import { Oval } from "react-loader-spinner";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const goBack = (event) => {
    event.preventDefault();
    window.history.back();
};

type MessageProps = {
    role: "user" | "assistant" | "code";
    text: string;
};

const UserMessage = ({ text }: { text: string }) => {
    return <div className={`${styles.userMessage} bg-[#000000] dark:bg-[#000000]`}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
    return (
        <div className={`${styles.assistantMessage} bg-[#000000] dark:bg-[#666666]`}>
            <Markdown>{text}</Markdown>
        </div>
    );
};

const CodeMessage = ({ text }: { text: string }) => {
    return (
        <div className={styles.codeMessage}>
            {text.split("\n").map((line, index) => (
                <div key={index}>
                    <span>{`${index + 1}. `}</span>
                    {line}
                </div>
            ))}
        </div>
    );
};

const Message = ({ role, text }: MessageProps) => {
    switch (role) {
        case "user":
            return <UserMessage text={text} />;
        case "assistant":
            return <AssistantMessage text={text} />;
        case "code":
            return <CodeMessage text={text} />;
        default:
            return null;
    }
};

type ChatProps = {
    assistantId: string;
    functionCallHandler?: (
        toolCall: RequiredActionFunctionToolCall
    ) => Promise<string>;
};

const Chat = ({
    assistantId,
    functionCallHandler = () => Promise.resolve(""),
}: ChatProps) => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [threadId, setThreadId] = useState("");
    const [sending, setSending] = useState(false);
    const [store, setStore] = useState("");

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

        const fetchData = async () => {
            const q = query(collection(db, "file-search"), where("assistantId", "==", assistantId));

            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.docs.map(doc => {
                    const dt = doc.data();
                    setStore(dt.name)
                });
            } catch (error) {
                console.error("Failed to fetch documents: ", error);
            }
        }

        fetchData();
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

    return (
        <main className={`${styles1.main} w-full flex flex-col`} style={{ height: isFullScreen ? "calc(100vh - 80px)" : "calc(100vh - 160px)" }} >
            <div className="w-full justfiy-start flex gap-3 items-center">
                <div onClick={goBack} style={{ cursor: 'pointer' }}>
                    <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                    </svg>
                </div>
                <div className="text-bold text-[20px]" >{store}</div><div>
                </div></div>
            <div className="flex sm:w-[55%]" style={{ height: isFullScreen ? "calc(100vh - 80px)" : "calc(100vh - 160px)" }}>
                <div className={styles.chatContainer}>
                    <div className={styles.chat}></div>
                    <div className={styles.chatContainer}>
                        <div className={styles.messages}>
                            {messages.map((msg, index) => (
                                <Message key={index} role={msg.role} text={msg.text} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className={`${styles.inputForm} ${styles.clearfix}`}
                        >
                            <input
                                type="text"
                                className={`${styles.input} dark:bg-[#282c32] outline-none`}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Enter your question"
                            />
                            <button
                                type="submit"
                                className={`${styles.button} border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700`}
                                disabled={inputDisabled}
                            >
                                {sending ? <Oval
                                    visible={true}
                                    height="20"
                                    width="30"
                                    color="#4A6CF7"
                                    secondaryColor='#3C56C0'
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                /> : "Send"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Chat;
