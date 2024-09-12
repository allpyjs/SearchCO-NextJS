import React from 'react'
import { Metadata } from "next";

import WebChatGPTPage from '@/components/WebChatGPT';

export const metadata: Metadata = {
    title: "Search.co | WebChatGPT Page",
    description: "This is WebChatGPT Page for Search.co",
};


const Page = () => {
    return (
        <WebChatGPTPage />
    )
}

export default Page
