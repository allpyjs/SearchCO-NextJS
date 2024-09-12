import React from 'react'
import { Metadata } from "next";

import APIDocumentPage from '@/components/API-Document';

export const metadata: Metadata = {
    title: "Search.co | API Document Page",
    description: "This is API Document Page for Search.co",
};


const Page = () => {
    return (
        <APIDocumentPage />
    )
}

export default Page
