import React from 'react'
import { Metadata } from "next";

import FileStoreChatPage from "@/components/File-Search/Chat";

import styles from "@/app/assistant/examples/shared/page.module.css";

import Chat from "@/components/assistant/chat";

export const metadata: Metadata = {
    title: "Search.co | File Datastore Chat Page",
    description: "This is File Datastore Chat Page for Search.co",
};

export interface PageProps {
    params: {
        id: string
    }
}

const Page = ({ params }: PageProps) => {
    return (
        <FileStoreChatPage assistantId={"asst_" + params.id} />
    )
}

export default Page
