import React from 'react'

import { Metadata } from "next";
import GoogleSearchPage from '@/components/google-search';
import Sidebar from '@/components/google-search/sidebar';
export const metadata: Metadata = {
    title: "Search.co | Google Search Page",
    description: "This is  Google Search Page for Search.co",
};

const Page = () => {
    return (
        <GoogleSearchPage />
    )
}

export default Page