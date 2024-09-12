import React from 'react'
import { Metadata } from "next";
import Users from "@/components/Users";
import FileSearchPage from '@/components/File-Search';

export const metadata: Metadata = {
    title: "Search.co | File Search Page",
    description: "This is File Search Page for Search.co",
};


const Page = () => {
    return (
        <FileSearchPage />
    )
}

export default Page
