import { Metadata } from 'next';
import React from 'react'
import ChatbotIframePage from "@/components/Chatbot-Iframe";

export const metadata: Metadata = {
    title: "Search.co | Chatbot Share Page",
    description: "This is Chatbot Share Page for Search.co",
};

export interface ChatbotIframeProps {
    params: {
        id: string
    }
}

const page = ({ params }: ChatbotIframeProps) => {
    return (
        <div>
            <ChatbotIframePage assistantId={"asst_" + params.id} />
        </div>
    )
}

export default page
