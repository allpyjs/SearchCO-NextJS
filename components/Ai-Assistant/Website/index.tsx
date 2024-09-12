"use client";

import { IconMistOff } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';

import DropDownDatastoreAction from "@/components/File-Search/DropDownDatastoreAction"
import DataStoreDeleteDialog from "@/components/File-Search/DataStoreDeleteDialog";
import DataStoreEditDialog from "@/components/File-Search/DataStoreEditDialog";
import DataStoreAddDialog from "@/components/File-Search/DataStoreAddDialog";
import EmbedWebsiteDialog from "@/components/File-Search/EmbedWebsiteDialog";
import MakePublicDialog from "@/components/File-Search/MakePublicDialog";

import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import { collection, DocumentData, DocumentReference, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';
import { DateStore } from '@/types/datastore';
import { toast } from 'react-toastify';
import { Link } from 'lucide-react';
import { useRouter } from 'next/navigation'

function truncateString(str, num) {
    if (str && str.length > num) {
        return str.slice(0, num) + "...";
    }
    return str;
}

const FileSearchPage = () => {
    const [loading, setLoading] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [pageCnt, setPageCnt] = useState(1);
    const { user } = useAuth();
    const [datastore, setDatastore] = useState([
    ]);
    const router = useRouter()
    const pageSize = 10;

    const fetchData = async (flag = "fetch") => {
        setLoading(true);
        setDatastore([]);

        try {
            let q = query(
                collection(db, "website-search"),
                where("public", "==", true),
                limit(pageSize)
            );

            if (flag === "next" && lastVisible) {
                q = query(q, startAfter(lastVisible));
            }

            if (flag === "pervious") {
                setPageCnt(pageCnt => pageCnt + 1)
            }

            const querySnapshot = await getDocs(q);
            const newStore = querySnapshot.docs.map(doc => {
                const dt = doc.data();
                return {
                    id: dt?.assistantId,
                    name: dt?.name,
                    docCnt: dt?.documents?.length || 0,
                    description: dt?.description,
                    public: dt?.public
                };
            });

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

            setDatastore(newStore);
        } catch (error) {
            console.error("Failed to fetch documents: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user])

    const handleGoToChat = (id) => {
        router.push(`/website-search/chat/${id.slice(5)}`)
    }

    return (
        <div className='w-full mt-[40px]'>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                    <thead className="text-xs text-white uppercase bg-[#4a6cf7] dark:text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && datastore && datastore?.map((item, index) => (
                            <tr key={index} className={`${index === 0 ? "" : "border-t"} text-black dark: text-white dark: bg-[#282c32] dark: border-[#222222]`}>
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-blue-100 text-center text-black dark:text-white">
                                    {(pageCnt - 1) * pageSize + index + 1}
                                </th>
                                <td className="px-6 py-4 text-center text-black dark:text-white" title={item?.description}>
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 text-center text-black dark:text-white" title={item?.description}>
                                    {truncateString(item?.description, 40)}
                                </td>
                                <td className="px-6 py-4 text-center text-black dark:text-white" title={item?.description}>
                                    <button onClick={e => handleGoToChat(item?.id)}>
                                        <svg height="20px" width="20px" viewBox="0 0 443.541 443.541" fill="#FFFFFF" stroke="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M76.579,433.451V335.26C27.8,300.038,0,249.409,0,195.254C0,93.155,99.486,10.09,221.771,10.09 s221.771,83.065,221.771,185.164s-99.486,185.164-221.771,185.164c-14.488,0-29.077-1.211-43.445-3.604L76.579,433.451z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {loading && <tr className='mt-8 select-none text-center text-white items-center w-full'>
                            <td colSpan={4} className='dark:bg-[#282c32]'>
                                <div className="flex flex-col items-center">
                                    <span className="text-[14px] leading-normal">
                                        <div className='mb-3 mt-3'>
                                            <Oval
                                                visible={true}
                                                height="30"
                                                width="100"
                                                color="#4A6CF7"
                                                secondaryColor='#3C56C0'
                                                ariaLabel="oval-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                            />
                                        </div>
                                    </span>
                                </div>
                            </td>
                        </tr>}
                        {!loading && datastore?.length === 0 && <tr className='mt-8 select-none text-center dark:bg-[#282c32] text-white items-center w-full'>
                            <td colSpan={4}>
                                <div className="flex flex-col items-center text-black dark:text-white py-[10px]">
                                    <IconMistOff className="mx-auto mb-3" />
                                    <span className="text-[14px] leading-normal">
                                        No Asistants
                                    </span>
                                </div>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>

            {!loading && datastore && datastore.length > 0 && (<div className='w-full flex justify-center gap-2 mt-[20px]'>
                <button onClick={() => fetchData("previous")} disabled={!lastVisible || pageCnt === 1} className='px-[20px] disabled:border-[#cccccc] disabled:hover:bg-gray-100 disabled:dark:border-[#333333] disabled:dark:hover:bg-gray-800 rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                    Previous
                </button>
                <button onClick={() => fetchData("next")} disabled={datastore.length < pageSize} className='px-[20px] disabled:border-[#cccccc] disabled:hover:bg-gray-100 disabled:dark:border-[#333333] disabled:dark:hover:bg-gray-800 rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                    Next
                </button>
            </div>)}
        </div>
    )
}

export default FileSearchPage
