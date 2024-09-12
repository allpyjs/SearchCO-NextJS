import React from 'react'
import { Metadata } from "next";

import ChatgptPage from '@/components/Chatgpt';

export const metadata: Metadata = {
    title: "Search.co | ChatGPT Page",
    description: "This is ChatGPT Page for Search.co",
};


const Page = () => {
    return (
        <ChatgptPage />
    )
}

export default Page
