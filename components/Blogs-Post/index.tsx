"use client";

import { IconMistOff } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import { collection, DocumentData, DocumentReference, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';
import { DateStore } from '@/types/datastore';
import DeleteDialog from "./delete/index";

function truncateString(str, num) {
    if (str && str.length > num) {
        return str.slice(0, num) + "...";
    }
    return str;
}

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [pageCnt, setPageCnt] = useState(1);
    const [deleteId, setDeleteId] = useState<string>("");
    const [isVisibleDeleteDataStore, setIsVisibleDeleteDataStore] = useState(false);
    const [editId, setEditId] = useState<string>("");
    const [editItem, setEditItem] = useState();
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
                collection(db, "posts"),
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
                    id: dt?.id,
                    title: dt?.title,
                    summary: dt?.summary
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

    const handleGotoEdit = (id) => {
        router.push(`/blogs-post/edit/${id}`);
    }

    const handleGotoPreview = (id) => {
        window.open(`/blog/blog-details/${id}`, '_blank');
    }

    const handleDelete = (id: string) => {
        console.log(id)
        setDeleteId(id);
        setIsVisibleDeleteDataStore(true)
    }


    return (
        <div className='w-full mt-[40px] px-3'>
            <div className='w-full flex justify-end py-2'>
                <button onClick={() => router.push("/blogs-post/new")} type='submit' className='px-[20px] mt-[10px] rounded-md items-center border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700' >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.013 6.175 7.006 9.369l5.007 3.194-5.007 3.193L2 12.545l5.006-3.193L2 6.175l5.006-3.194 5.007 3.194ZM6.981 17.806l5.006-3.193 5.006 3.193L11.987 21l-5.006-3.194Z" />
                        <path d="m12.013 12.545 5.006-3.194-5.006-3.176 4.98-3.194L22 6.175l-5.007 3.194L22 12.562l-5.007 3.194-4.98-3.211Z" />
                    </svg>
                    New Post
                </button>
            </div>

            <DeleteDialog
                open={isVisibleDeleteDataStore}
                onClose={() => {
                    setIsVisibleDeleteDataStore(false);
                }}
                fetchStoreData={fetchData}
                id={deleteId}
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                    <thead className="text-xs text-white uppercase bg-[#4a6cf7] dark:text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3 text-center" >
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-center" >
                                Summary
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && datastore && datastore?.map((item, index) => (
                            <tr key={index} className={`${index === 0 ? "" : "border-t"} text-black dark:text-white dark:bg-[#282c32] dark:border-[#222222]`}>
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-blue-100 text-center text-black dark:text-white">
                                    {(pageCnt - 1) * pageSize + index + 1}
                                </th>
                                <td className="px-6 py-4 text-center text-black dark:text-white" >
                                    {item?.title}
                                </td>
                                <td className="px-6 py-4 text-center text-black dark:text-white" title={item?.summary} >
                                    {truncateString(item?.summary, 40)}
                                </td>
                                <td className="px-6 py-4 text-center text-black dark:text-white">
                                    <div className='flex justify-center gap-4'>
                                        <button
                                            onClick={() => handleGotoPreview(item?.id)}
                                        >
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item?.id)}
                                        >
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleGotoEdit(item?.id)}>
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </button>
                                    </div>
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

export default Page
