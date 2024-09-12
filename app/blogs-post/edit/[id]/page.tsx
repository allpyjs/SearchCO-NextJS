import React from 'react'
import { Metadata } from "next";

import EditBlogsPostPage from '@/components/Blogs-Post/edit';

export const metadata: Metadata = {
    title: "Search.co | Blog Post Page",
    description: "This is Blog Post Page for Search.co",
};


export interface PageProps {
    params: {
        id: string
    }
}

const Page = ({ params }: PageProps) => {
    return (
        <EditBlogsPostPage id={params.id} />
    )
}

export default Page
