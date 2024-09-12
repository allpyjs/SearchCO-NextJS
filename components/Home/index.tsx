"use client"
import React from 'react'
import HomeContext from "@/contexts/homeContext";
import { useContext } from "react";

const HomePage = () => {
    const {
        state: {
            isFullScreen
        },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    return (
        <div className="flex w-full flex flex-col justify-center items-center" style={{ height: isFullScreen ? 'calc(100vh - 100px)' : 'calc(100vh - 180px)' }} >
            <div>
                <svg className="w-30 h-30 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="124" height="124" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <div className="font-bold text-[50px] mb-[20px]">GPT Search Engine For Business</div>
            <div className="text-[25px] mb-[80px] text-[#525a71]">Enhance your personal and business searches with Search.co, powered by GPT!</div>
        </div>
    )
}

export default HomePage
