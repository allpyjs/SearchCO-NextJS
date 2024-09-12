import React from 'react'
import { Metadata } from "next";

import PageSkeletonPage from '@/components/Page-Skeleton';

export const metadata: Metadata = {
    title: "Search.co | Page Skeleton Page",
    description: "This is Page Skeleton Page for Search.co",
};


const Page = () => {
    return (
        <PageSkeletonPage />
    )
}

export default Page
