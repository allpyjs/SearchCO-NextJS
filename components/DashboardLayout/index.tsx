"use client";
import React, { useContext, useEffect, useState } from 'react'
import Link from "next/link";
import { IconLogout } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/authContext";
import ThemeToggler from '../Header/ThemeToggler';
import HomeContext from '@/contexts/homeContext';
import { FaRobot } from "react-icons/fa6";
import { AiFillAmazonSquare } from "react-icons/ai";
import { MdOutlineWebhook } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useLogout } from "@/lib/auth/logout";
import { UseridDialog } from "@/components/Common/Dialogs/UseridDialog"

const DashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname();
    const { logout } = useLogout();

    const isActive = (pth) => pathname === pth;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const {
        state: {
            isFullScreen,
            isUseridDialogOpen
        },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        fetch('/api/prompts').then(resp => resp.json()).then(async (data) => {
            const libraryPromptsTemp = data.map((item: { id: number, name: string, content: string }) => (
                {
                    id: item.id,
                    label: item.name,
                    value: item.content
                }
            ))

            homeDispatch({ field: "libraryPrompts", value: libraryPromptsTemp })
        })
    }, [])

    useEffect(() => {
        if (user) {
            const fetchPromptsData = async () => {
                const promptssRef = collection(db, "history", user?.email, "prompts");
                try {
                    const querySnapshot = await getDocs(promptssRef);
                    const prompts = querySnapshot.docs.map(doc => ({
                        ...doc.data()
                    }));
                    homeDispatch({ field: 'prompts', value: prompts });
                } catch (error) {
                    console.error("Failed to fetch prompts:", error);
                }
            }
            fetchPromptsData();

            const fetchFolderData = async () => {
                if (user) {
                    const foldersRef = collection(db, "history", user?.email, "folders");

                    try {
                        const querySnapshot = await getDocs(foldersRef);
                        const folders = querySnapshot.docs.map(doc => ({
                            ...doc.data()
                        }));
                        homeDispatch({ field: 'folders', value: folders });

                    } catch (error) {
                        console.error("Failed to fetch conversations:", error);
                    }
                }
            }
            fetchFolderData();

            const fetchData = async () => {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        homeDispatch({ field: "isUseridDialogOpen", value: true })
                    }
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
            }
            fetchData();
        }
    }, [user])

    return <>
        {!isFullScreen && <nav className={`fixed top-0 z-50 w-full bg-[#f8f8f8] border-b border-gray-200 dark:bg-[#1d2430] dark:border-gray-700 overflow-x-hidden`}>
            <div className="px-3 py-4 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            onClick={toggleSidebar}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-15  " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <div className="flex ms-2 md:me-24">
                            <Image
                                src="/images/logo/logo-white.png"
                                alt="logo"
                                width={130}
                                height={25}
                                className="w-full dark:hidden"
                                style={{ width: "auto", height: "auto" }}
                                priority
                            />
                            <Image
                                src="/images/logo/logo-dark.png"
                                alt="logo"
                                width={130}
                                height={25}
                                className="hidden w-full dark:block"
                                style={{ width: "auto", height: "auto" }}
                                priority
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3">
                            <ThemeToggler />
                        </div>
                    </div>
                </div>
            </div >
        </nav >}

        {
            !isFullScreen && <aside id="logo-sidebar" className={`sidebar-scrollbar fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-[#f8f8f8] border-r border-gray-200 sm:translate-x-0 dark:bg-[#1d2430] dark:border-gray-700  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Sidebar">
                <div className="h-full px-1 pb-4 overflow-y-auto bg-[#f8f8f8]] flex flex-col justify-between sidebar-scrollbar mt-[90px]">
                    <div>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/chatgpt" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/chatgpt') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className='dark:hidden w-6 h-6' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                        <path d="M 22.390625 3.0078125 C 17.654395 2.8436595 13.569833 5.8435619 11.859375 10.025391 C 9.0176557 10.679494 6.5710372 12.403786 5.0136719 14.898438 C 2.5039309 18.9172 3.0618709 23.952784 5.828125 27.525391 C 4.9739102 30.313925 5.2421456 33.294602 6.6230469 35.890625 C 8.849447 40.074109 13.491637 42.111879 17.96875 41.501953 C 19.956295 43.635551 22.671724 44.892008 25.609375 44.994141 C 30.344873 45.157538 34.429949 42.156517 36.140625 37.974609 C 38.982335 37.320506 41.427906 35.596214 42.984375 33.101562 C 45.494116 29.082044 44.937696 24.046828 42.171875 20.474609 C 43.02609 17.686075 42.757854 14.705398 41.376953 12.109375 C 39.150553 7.9258913 34.508363 5.8881211 30.03125 6.4980469 C 28.043705 4.3644591 25.328276 3.109049 22.390625 3.0078125 z M 21.632812 6.0078125 C 23.471341 5.9259913 25.222619 6.4704661 26.662109 7.5058594 C 26.386892 7.6365081 26.113184 7.7694041 25.845703 7.9238281 L 18.322266 12.267578 C 17.829266 12.552578 17.523484 13.077484 17.521484 13.646484 L 17.470703 25.443359 L 14 23.419922 L 14 14.277344 C 14 9.9533438 17.312812 6.1998125 21.632812 6.0078125 z M 31.925781 9.3496094 C 34.481875 9.4330566 36.944688 10.675 38.398438 12.953125 C 39.388773 14.504371 39.790276 16.293997 39.613281 18.058594 C 39.362598 17.885643 39.111144 17.712968 38.84375 17.558594 L 31.320312 13.216797 C 30.827312 12.932797 30.220562 12.930891 29.726562 13.212891 L 19.486328 19.066406 L 19.503906 15.050781 L 27.421875 10.478516 C 28.825875 9.6677656 30.392125 9.299541 31.925781 9.3496094 z M 11.046875 13.449219 C 11.022558 13.752013 11 14.055332 11 14.363281 L 11 23.050781 C 11 23.619781 11.302922 24.146594 11.794922 24.433594 L 21.984375 30.376953 L 18.498047 32.369141 L 10.580078 27.798828 C 6.8350781 25.635828 5.240375 20.891687 7.234375 17.054688 C 8.0826085 15.421856 9.4306395 14.178333 11.046875 13.449219 z M 29.501953 15.630859 L 37.419922 20.201172 C 41.164922 22.364172 42.759625 27.108313 40.765625 30.945312 C 39.917392 32.578144 38.569361 33.821667 36.953125 34.550781 C 36.977447 34.247986 37 33.944668 37 33.636719 L 37 24.949219 C 37 24.380219 36.697078 23.853406 36.205078 23.566406 L 26.015625 17.623047 L 29.501953 15.630859 z M 24.019531 18.763672 L 28.544922 21.400391 L 28.523438 26.638672 L 23.980469 29.236328 L 19.455078 26.599609 L 19.476562 21.361328 L 24.019531 18.763672 z M 30.529297 22.556641 L 34 24.580078 L 34 33.722656 C 34 38.046656 30.687188 41.800187 26.367188 41.992188 C 24.528659 42.074009 22.777381 41.529534 21.337891 40.494141 C 21.613108 40.363492 21.886816 40.230596 22.154297 40.076172 L 29.677734 35.732422 C 30.170734 35.447422 30.476516 34.922516 30.478516 34.353516 L 30.529297 22.556641 z M 28.513672 28.933594 L 28.496094 32.949219 L 20.578125 37.521484 C 16.834125 39.683484 11.927563 38.691875 9.6015625 35.046875 C 8.6112269 33.495629 8.2097244 31.706003 8.3867188 29.941406 C 8.6374463 30.114402 8.8888065 30.286983 9.15625 30.441406 L 16.679688 34.783203 C 17.172688 35.067203 17.779438 35.069109 18.273438 34.787109 L 28.513672 28.933594 z"></path>
                                    </svg>
                                    <svg className='hidden dark:block w-6 h-6' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                        <path fill='#ffffff' d="M 22.390625 3.0078125 C 17.654395 2.8436595 13.569833 5.8435619 11.859375 10.025391 C 9.0176557 10.679494 6.5710372 12.403786 5.0136719 14.898438 C 2.5039309 18.9172 3.0618709 23.952784 5.828125 27.525391 C 4.9739102 30.313925 5.2421456 33.294602 6.6230469 35.890625 C 8.849447 40.074109 13.491637 42.111879 17.96875 41.501953 C 19.956295 43.635551 22.671724 44.892008 25.609375 44.994141 C 30.344873 45.157538 34.429949 42.156517 36.140625 37.974609 C 38.982335 37.320506 41.427906 35.596214 42.984375 33.101562 C 45.494116 29.082044 44.937696 24.046828 42.171875 20.474609 C 43.02609 17.686075 42.757854 14.705398 41.376953 12.109375 C 39.150553 7.9258913 34.508363 5.8881211 30.03125 6.4980469 C 28.043705 4.3644591 25.328276 3.109049 22.390625 3.0078125 z M 21.632812 6.0078125 C 23.471341 5.9259913 25.222619 6.4704661 26.662109 7.5058594 C 26.386892 7.6365081 26.113184 7.7694041 25.845703 7.9238281 L 18.322266 12.267578 C 17.829266 12.552578 17.523484 13.077484 17.521484 13.646484 L 17.470703 25.443359 L 14 23.419922 L 14 14.277344 C 14 9.9533438 17.312812 6.1998125 21.632812 6.0078125 z M 31.925781 9.3496094 C 34.481875 9.4330566 36.944688 10.675 38.398438 12.953125 C 39.388773 14.504371 39.790276 16.293997 39.613281 18.058594 C 39.362598 17.885643 39.111144 17.712968 38.84375 17.558594 L 31.320312 13.216797 C 30.827312 12.932797 30.220562 12.930891 29.726562 13.212891 L 19.486328 19.066406 L 19.503906 15.050781 L 27.421875 10.478516 C 28.825875 9.6677656 30.392125 9.299541 31.925781 9.3496094 z M 11.046875 13.449219 C 11.022558 13.752013 11 14.055332 11 14.363281 L 11 23.050781 C 11 23.619781 11.302922 24.146594 11.794922 24.433594 L 21.984375 30.376953 L 18.498047 32.369141 L 10.580078 27.798828 C 6.8350781 25.635828 5.240375 20.891687 7.234375 17.054688 C 8.0826085 15.421856 9.4306395 14.178333 11.046875 13.449219 z M 29.501953 15.630859 L 37.419922 20.201172 C 41.164922 22.364172 42.759625 27.108313 40.765625 30.945312 C 39.917392 32.578144 38.569361 33.821667 36.953125 34.550781 C 36.977447 34.247986 37 33.944668 37 33.636719 L 37 24.949219 C 37 24.380219 36.697078 23.853406 36.205078 23.566406 L 26.015625 17.623047 L 29.501953 15.630859 z M 24.019531 18.763672 L 28.544922 21.400391 L 28.523438 26.638672 L 23.980469 29.236328 L 19.455078 26.599609 L 19.476562 21.361328 L 24.019531 18.763672 z M 30.529297 22.556641 L 34 24.580078 L 34 33.722656 C 34 38.046656 30.687188 41.800187 26.367188 41.992188 C 24.528659 42.074009 22.777381 41.529534 21.337891 40.494141 C 21.613108 40.363492 21.886816 40.230596 22.154297 40.076172 L 29.677734 35.732422 C 30.170734 35.447422 30.476516 34.922516 30.478516 34.353516 L 30.529297 22.556641 z M 28.513672 28.933594 L 28.496094 32.949219 L 20.578125 37.521484 C 16.834125 39.683484 11.927563 38.691875 9.6015625 35.046875 C 8.6112269 33.495629 8.2097244 31.706003 8.3867188 29.941406 C 8.6374463 30.114402 8.8888065 30.286983 9.15625 30.441406 L 16.679688 34.783203 C 17.172688 35.067203 17.779438 35.069109 18.273438 34.787109 L 28.513672 28.933594 z"></path>
                                    </svg>
                                    <span className="ms-3">ChatGPT</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/gemini" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/gemini') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8.737 8.737a21.49 21.49 0 0 1 3.308-2.724m0 0c3.063-2.026 5.99-2.641 7.331-1.3 1.827 1.828.026 6.591-4.023 10.64-4.049 4.049-8.812 5.85-10.64 4.023-1.33-1.33-.736-4.218 1.249-7.253m6.083-6.11c-3.063-2.026-5.99-2.641-7.331-1.3-1.827 1.828-.026 6.591 4.023 10.64m3.308-9.34a21.497 21.497 0 0 1 3.308 2.724m2.775 3.386c1.985 3.035 2.579 5.923 1.248 7.253-1.336 1.337-4.245.732-7.295-1.275M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                    </svg>

                                    <span className="ms-3">Google Gemini</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/perplexity" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/perplexity') ? 'bg-gray-200 dark:bg-gray-700' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                                    </svg>

                                    <span className="ms-3">Perplexity</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/google-search" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/google-search') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clipRule="evenodd" />
                                    </svg>

                                    <span className="ms-3">Google Search</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/file-search" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/file-search') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                                    </svg>
                                    <span className="ms-3">File Search</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/website-search" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/website-search') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>

                                    <span className="ms-3">Website Search</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/ai-assistants" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/ai-assistants') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <FaRobot className='w-6 h-6' />
                                    <span className="ms-3">AI Assistants</span>
                                </Link>
                            </li>
                        </ul>

                        {/* <ul className="space-y-2 font-medium mt-1">
                        <li>
                            <Link href="/voice-bot" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/voice-bot') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M18.458 3.11A1 1 0 0 1 19 4v16a1 1 0 0 1-1.581.814L12 16.944V7.056l5.419-3.87a1 1 0 0 1 1.039-.076ZM22 12c0 1.48-.804 2.773-2 3.465v-6.93c1.196.692 2 1.984 2 3.465ZM10 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6V8Zm0 9H5v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3Z" clip-rule="evenodd" />
                                </svg>

                                <span className="ms-3">Voice Bot</span>
                            </Link>
                        </li>
                    </ul> */}
                        {/* <ul className="space-y-2 font-medium mt-1">
                        <li>
                            <Link href="/amazonq" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/amazonq') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                <AiFillAmazonSquare className='w-6 h-6' />
                                <span className="ms-3">Amazon Q</span>
                            </Link>
                        </li>
                    </ul> */}
                        {/* <ul className="space-y-2 font-medium mt-1">
                        <li>
                            <Link href="/webchatgpt" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/webchatgpt') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                <MdOutlineWebhook className='w-6 h-6' />
                                <span className="ms-3">WebchatGPT</span>
                            </Link>
                        </li>
                    </ul> */}
                        {/* <ul className="space-y-2 font-medium mt-1">
                        <li>
                            <Link href="/seo-tool" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/seo-tool') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                </svg>

                                <span className="ms-3">SEO Tool</span>
                            </Link>
                        </li>
                    </ul> */}
                        {user && <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/users" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/users') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>

                                    <span className="ms-3">Users</span>
                                </Link>
                            </li>
                        </ul>}
                        {user && <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/profile-setting" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/profile-setting') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                    </svg>
                                    <span className="ms-3">Profile</span>
                                </Link>
                            </li>
                        </ul>}
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/pricing" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/pricing') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                    </svg>
                                    <span className="ms-3">Pricing</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/about" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/about') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ms-3">About</span>
                                </Link>
                            </li>
                        </ul>
                        {user && user?.role === "admin" && <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/blogs-post" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/blogs-post') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z" />
                                    </svg>

                                    <span className="ms-3">Blog Post</span>
                                </Link>
                            </li>
                        </ul>}
                        {/* <ul className="space-y-2 font-medium mt-1 flex sm:hidden">
                            <li>
                                <Link href="/privacy-policy" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/privacy-policy') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clipRule="evenodd" />
                                    </svg>

                                    <span className="ms-3">Privacy Policy</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium mt-1 flex sm:hidden">
                            <li>
                                <Link href="/terms-of-service" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/terms-of-service') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z" />
                                    </svg>

                                    <span className="ms-3">Terms of Services</span>
                                </Link>
                            </li>
                        </ul> */}
                        {/* <ul className="space-y-2 font-medium mt-1 flex sm:hidden">
                        <li>
                            <Link href="/api-document" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/api-document') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-5-4v4h4V3h-4Z" />
                                </svg>

                                <span className="ms-3">API Document</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className="space-y-2 font-medium mt-1 flex sm:hidden">
                        <li>
                            <Link href="/document" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/document') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
                                </svg>

                                <span className="ms-3">Documentation</span>
                            </Link>
                        </li>
                    </ul> */}

                        {!user && <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/signin" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/signin') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd" />
                                    </svg>

                                    <span className="ms-3">Sign In</span>
                                </Link>
                            </li>
                        </ul>}
                        {!user && <ul className="space-y-2 font-medium mt-1">
                            <li>
                                <Link href="/signup" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group ${isActive('/signup') ? 'bg-gray-200 dark:bg-gray-700 ' : ''} `} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                    </svg>

                                    <span className="ms-3">Sign Up</span>
                                </Link>
                            </li>
                        </ul>}
                        {user && <ul className="space-y-2 font-medium mt-1" onClick={logout} >
                            <li>
                                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group cursor-pointer">
                                    <IconLogout className='w-6 h-6' />
                                    <span className="ms-3">Logout</span>
                                </div>
                            </li>
                        </ul>}
                    </div>
                </div>
            </aside>
        }

        <div className={`${isFullScreen ? "sm:ml-0" : "sm:ml-64 pt-[89px]"} bg-[#f8f8f8] min-h-screen dark:bg-[#1d2430] relative`}>
            <div className='w-full h-full' >
                {children}
            </div>
        </div>

        <div className="hidden sm:flex text-[12px] fixed bottom-[0px] w-full justify-center bg-transparent">
            <div
                className={`flex ${isFullScreen ? "sm:ml-0" : "sm:ml-64"
                    } justify-center`}
                style={{ width: isFullScreen ? "calc(100vw)" : "calc(100vw - 350px)" }}
            >
                <Link href="/privacy-policy">
                    <div className="text-[#7f8699] hover:text-[#aaaaaa] cursor-pointer p-2">
                        Privacy Policy
                    </div>
                </Link>
                &nbsp;&nbsp; <span className="text-[#7f8699] p-2">|</span> &nbsp;&nbsp;
                <Link href="/terms-of-service">
                    <div className="text-[#7f8699] hover:text-[#aaaaaa] cursor-pointer p-2">
                        Terms of Services
                    </div>
                </Link>
                {/* &nbsp;&nbsp; <span className="text-[#7f8699] py-[20px]">|</span> &nbsp;&nbsp;
                <Link href="/api-document" className='p-[20px]'>
                    <div className="text-[#7f8699] hover:text-[#aaaaaa] cursor-pointer">
                        API
                    </div>
                </Link>
                &nbsp;&nbsp; <span className="text-[#7f8699] py-[20px]">|</span> &nbsp;&nbsp;
                <Link href="/document" className='p-[20px]'>
                    <div className="text-[#7f8699] hover:text-[#aaaaaa] cursor-pointer">
                        Documentation
                    </div>
                </Link> */}
            </div>
            <div className='hidden xl:flex'>
                <div className="group fixed bottom-[10px] right -[20px] p-2 flex items-end justify-end w-44 h-44 z-1000   ">
                    <div className="text-white shadow-xl flex items-center justify-center p-3 rounded-full absolute">
                        <div className='w-full flex justify-end italic text-[#718096] gap-2 fixed right-[20px]'>
                            <label className="inline-flex items-center cursor-pointer hidden sm:block">
                                <input type="checkbox" value="" className="sr-only peer" checked={isFullScreen} onChange={e => { homeDispatch({ field: "isFullScreen", value: !isFullScreen }) }} />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <UseridDialog
            open={isUseridDialogOpen}
            onClose={() => {
                homeDispatch({ field: "isUseridDialogOpen", value: false });
            }}
        />
    </>
}

export default DashboardLayout
function dispatch(arg0: { field: string; value: boolean; }) {
    throw new Error('Function not implemented.');
}

