import React from 'react'
import { Metadata } from "next";

import DocumentsPage from '@/components/File-Search/Datastore';

export const metadata: Metadata = {
    title: "Search.co | Documents Page",
    description: "This is Documents Page for Search.co",
};

export interface PageProps {
    params: {
        id: string
    }
}

const Page = ({ params }: PageProps) => {
    return (
        <DocumentsPage id={"asst_" + params.id} />
    )
}

export default Page
