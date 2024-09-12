import React from 'react'
import { Metadata } from "next";

import BlogsPostPage from '@/components/Blogs-Post';

export const metadata: Metadata = {
    title: "Search.co | Blog Post Page",
    description: "This is Blog Post Page for Search.co",
};


const Page = () => {
    return (
        <BlogsPostPage />
    )
}

export default Page
