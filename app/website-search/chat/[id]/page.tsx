import React from 'react'
import { Metadata } from "next";

import WebsiteStoreChatPage from "@/components/Website-Search/Chat";

export const metadata: Metadata = {
    title: "Search.co | Website Datastore Chat Page",
    description: "This is Website Datastore Chat Page for Search.co",
};

export interface PageProps {
    params: {
        id: string
    }
}

const Page = ({ params }: PageProps) => {
    return (
        <WebsiteStoreChatPage assistantId={"asst_" + params.id} />
    )
}

export default Page
