import React from 'react'
import { Metadata } from "next";

import AmazonQPage from '@/components/AmazonQ';

export const metadata: Metadata = {
    title: "Search.co | Amazon Q Page",
    description: "This is Amzon Q Page for Search.co",
};


const Page = () => {
    return (
        <AmazonQPage />
    )
}

export default Page
