import React from 'react'
import { Metadata } from "next";

import PerplexityPage from '@/components/Perplexity';

export const metadata: Metadata = {
    title: "Search.co | Perplexity Page",
    description: "This is Perplexity Page for Search.co",
};


const Page = () => {
    return (
        <PerplexityPage />
    )
}

export default Page
