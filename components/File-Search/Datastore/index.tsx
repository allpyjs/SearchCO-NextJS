"use client";

import { IconMistOff } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner';

import DropDownDocumentAction from "@/components/File-Search/DropDownDocumentAction"
import DocumentDeleteDialog from "@/components/File-Search/DocumentDeleteDialog";
import DocumentAddDialog from "@/components/File-Search/DocumentAddDialog";

import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { DateStore } from '@/types/datastore';
import { assistantId } from '@/app/assistant/assistant-config';
import { Document } from '@/types/datastore';

interface PageProps {
    id: string
}

const Page = ({ id }: PageProps) => {
    const [loading, setLoading] = useState(false);
    const [isVisibleAddDocument, setIsVisibleAddDocument] = useState(false);
    const [isVisibleDeleteDocument, setIsVisibleDeleteDocument] = useState(false);
    const [isVisibleEditDocument, setIsVisibleEditDocument] = useState(false);
    const [deleteId, setDeleteId] = useState<string>("");
    const [editId, setEditId] = useState<string>("");
    const [editItem, setEditItem] = useState();
    const [lastVisible, setLastVisible] = useState(null);
    const [pageCnt, setPageCnt] = useState(1);
    const [first, setFirst] = useState(true);
    const { user } = useAuth();
    const [documents, setDocuments] = useState([
    ]);

    const pageSize = 10;

    const fetchData = async (flag = "fetch") => {
        setLoading(true);
        setDocuments([]);

        try {
            let q = query(
                collection(db, "file-search"),
                where("assistantId", "==", id),
                limit(pageSize)
            );

            if (flag === "next" && lastVisible) {
                q = query(q, startAfter(lastVisible));
            }

            if (flag === "next") {
                setPageCnt(pageCnt => pageCnt + 1)
            }
            else if (flag === "previous") {
                setPageCnt(pageCnt => pageCnt - 1)
            }

            const querySnapshot = await getDocs(q);
            const newDocuments = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const dts = data.documents;

                let documents = dts?.map(item => {
                    return {
                        id: item?.fileId,
                        name: item?.name,
                        type: item?.type,
                    };
                })

                return documents;
            });

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

            setDocuments(newDocuments[0]);
        } catch (error) {
            console.error("Failed to fetch document s: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user])

    const addDocument = (newDocument: Document) => {
        setDocuments(documents => [...documents, newDocument])
    }

    const handleRefreshDelete = (fileId: string) => {
        let dt = documents?.filter(item => item.id !== fileId);
        setDocuments(dt);
    }

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setIsVisibleDeleteDocument(true)
    }

    const handleUpdateDocument = (id, name) => {
        console.log(id, name)
        let data = documents.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    name
                }
            }
            else return item;
        })
        setDocuments(data);
    }

    return (
        <div className='w-full px-3'>
            <div className='w-full mt-[23px]'>
                <div className='flex w-full justify-end pt-[10px]'>
                    <button onClick={() => setIsVisibleAddDocument(true)} className='px-[20px] rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                        + Add A Document
                    </button>
                </div>
            </div>

            <DocumentAddDialog
                open={isVisibleAddDocument}
                onClose={() => {
                    setIsVisibleAddDocument(false);
                }}
                addDocument={addDocument}
                id={id}
            />

            <DocumentDeleteDialog
                open={isVisibleDeleteDocument}
                onClose={() => {
                    setIsVisibleDeleteDocument(false);
                }}
                handleRefreshDelete={handleRefreshDelete}
                fileId={deleteId}
                id={id}
            />

            <div className="custom-scrollbar shadow-md sm:rounded-lg">
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
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && documents && documents?.map((item, index) => (
                            <tr className={`${index === 0 ? "" : "border-t"} text-black dark:text-white dark:bg-[#282c32] dark:border-[#222222]`}>
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-blue-100 text-center text-black dark:text-white">
                                    {(pageCnt - 1) * pageSize + index + 1}
                                </th>
                                <td className="px-6 text-center text-black dark:text-white">
                                    {item?.name}
                                </td>
                                <td className="px-6 text-center text-black dark:text-white">
                                    {item?.type}
                                </td>
                                <td className="px-6 text-center text-black dark:text-white">
                                    <DropDownDocumentAction id={item?.id} handleDelete={handleDelete} />                                </td>
                            </tr>
                        ))}
                        {loading && <tr className='mt-8 select-none text-center text-white items-center w-full'>
                            <td colSpan={5} className='dark:bg-[#282c32]'>
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
                        {!loading && documents?.length === 0 && <tr className='mt-8 select-none text-center dark:bg-[#282c32] text-white items-center w-full'>
                            <td colSpan={5}>
                                <div className="flex flex-col items-center text-black dark:text-white py-[10px]">
                                    <IconMistOff className="mx-auto mb-3" />
                                    <span className="text-[14px] leading-normal">
                                        No File Datastore
                                    </span>
                                </div>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>

            {!loading && documents && documents.length > 0 && (<div className='w-full flex justify-center gap-2 mt-[20px]'>
                <button onClick={() => fetchData("previous")} disabled={!lastVisible || pageCnt === 1} className='px-[20px] disabled:border-[#cccccc] disabled:hover:bg-gray-100 disabled:dark:border-[#333333] disabled:dark:hover:bg-gray-800 rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                    Previous
                </button>
                <button onClick={() => fetchData("next")} disabled={documents.length < pageSize} className='px-[20px] disabled:border-[#cccccc] disabled:hover:bg-gray-100 disabled:dark:border-[#333333] disabled:dark:hover:bg-gray-800 rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                    Next
                </button>
            </div>)}
        </div>
    )
}

export default Page
