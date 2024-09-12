"use client";
import { db } from '@/config/firebase';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

type DropdownButtonProps = {
    id: string;
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
    handleEmbedDialog: (id: string) => void;
}

const DropDownDatastoreAction = ({ id, handleDelete, handleEdit, handleEmbedDialog }: DropdownButtonProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button id="dropdownMenuIconButton"
                onClick={toggleDropdown}
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>

            {isDropdownOpen && (
                <div id="dropdownDots" style={{ position: 'absolute', zIndex: 1000, top: '40px', right: '20px' }}
                    className="bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                        <li>
                            <Link href={`/website-search/chat/${id.slice(5)}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Chat</Link>
                        </li>
                        <li>
                            <Link href={`/website-integration/chatbot-iframe/${id.slice(5)}`} target='_blank' className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Share</Link>
                        </li>
                        <li>
                            <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={() => { setIsDropdownOpen(false); handleEmbedDialog(id) }} >Embed</div>
                        </li>
                        <li>
                            <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={() => { setIsDropdownOpen(false); handleEdit(id) }} >Edit</div>
                        </li>
                    </ul>
                    <div className="py-2">
                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer" onClick={() => { setIsDropdownOpen(false); handleDelete(id) }} >Delete</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropDownDatastoreAction;
