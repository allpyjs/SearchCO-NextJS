import React from 'react'
import { Metadata } from "next";

import DocumentationPage from "@/components/Document";

export const metadata: Metadata = {
    title: "Search.co | Documentation Page",
    description: "This is Documentation Page for Search.co",
};


const Page = () => {
    return (
        <DocumentationPage />
    )
}

export default Page