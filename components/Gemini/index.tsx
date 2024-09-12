"use client";
import HomeContext from '@/contexts/homeContext';
import React, { useContext } from 'react'
import MainBar from './MainBar';
import { Prompt } from 'next/font/google';
import PromptBar from '@/components/Common/PromptBar';
import HistoryBar from './HistoryBar';

const index = () => {
    const {
        state: {
            isFullScreen
        },
    } = useContext(HomeContext);

    return (
        <div className="relative flex-1 overflow-hidden bg-[#f8f8f8] dark:bg-[#1d2430] flex" style={{ height: isFullScreen ? "calc(100vh - 0px)" : "calc(100vh - 89px)" }}>
            <HistoryBar />
            <MainBar />
            <PromptBar />
        </div>
    )
}

export default index
