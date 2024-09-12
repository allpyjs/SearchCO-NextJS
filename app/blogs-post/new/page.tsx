import React from 'react'
import { Metadata } from "next";

import NewBlogPostPage from '@/components/Blogs-Post/new';

export const metadata: Metadata = {
    title: "Search.co | Blog Post Page",
    description: "This is Blog Post Page for Search.co",
};


const Page = () => {
    return (
        <NewBlogPostPage />
    )
}

export default Page
