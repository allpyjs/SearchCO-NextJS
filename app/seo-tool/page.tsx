import React from 'react'
import { Metadata } from "next";

import SeoToolPage from '@/components/Seo-Tool';

export const metadata: Metadata = {
    title: "Search.co | SEO Tool Page",
    description: "This is SEO Tool Page for Search.co",
};


const Page = () => {
    return (
        <SeoToolPage />
    )
}

export default Page
