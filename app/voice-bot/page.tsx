import React from 'react'
import { Metadata } from "next";

import VoiceBotPage from '@/components/Voice-Bot';

export const metadata: Metadata = {
    title: "Search.co | Voice Bot Page",
    description: "This is Voice Bot Page for Search.co",
};


const Page = () => {
    return (
        <VoiceBotPage />
    )
}

export default Page
