"use client";
import React, { useState } from 'react';

import Website from "@/components/Ai-Assistant/Website";
import Document from "@/components/Ai-Assistant/Document";

const Page = () => {
    const [activeTab, setActiveTab] = useState('Document');

    const tabs = [
        { id: 'Document', label: 'Document' },
        { id: 'Website', label: 'Website' },
    ];

    return (
        <div className='w-full px-3'>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    {tabs.map(tab => (
                        <li key={tab.id} className="me-2">
                            <div
                                onClick={() => setActiveTab(tab.id)}
                                className={`inline-block p-4 rounded-t-lg border-b-2 cursor-pointer ${tab.id === activeTab
                                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                    }`}
                                aria-current={tab.id === activeTab ? 'page' : undefined}
                            >
                                {tab.label}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='w-full'>
                {activeTab == "Document" ? <Document /> : <Website />}
            </div>
        </div>
    );
};

export default Page;
