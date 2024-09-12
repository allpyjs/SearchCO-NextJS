import React from 'react'
import { Metadata } from "next";

import WebsiteSeachPage from '@/components/Website-Search';

export const metadata: Metadata = {
    title: "Search.co | Website Search Page",
    description: "This is Website Search Page for Search.co",
};


const Page = () => {
    return (
        <WebsiteSeachPage />
    )
}

export default Page
