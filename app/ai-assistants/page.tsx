import React from 'react'
import { Metadata } from "next";

import AIAssistant from "@/components/Ai-Assistant";

export const metadata: Metadata = {
    title: "Search.co | AI Assistants Page",
    description: "This is AI Assistants Page for Search.co",
};

const Page = () => {
    return (
        <div className='w-full'>
            <AIAssistant />
        </div>
    )
}

export default Page
