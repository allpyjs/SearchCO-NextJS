import React from 'react'
import { Metadata } from "next";

import GeminiPage from '@/components/Gemini';

export const metadata: Metadata = {
    title: "Search.co | Gemini Page",
    description: "This is Gemini Page for Search.co",
};


const Page = () => {
    return (
        <GeminiPage />
    )
}

export default Page
