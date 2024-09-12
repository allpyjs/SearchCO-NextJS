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

const FileSearchPage = () => {
    const [loading, setLoading] = useState(false);
    const [isVisibleAddDataStore, setIsVisibleAddDataStore] = useState(false);
    const [isVisibleDeleteDataStore, setIsVisibleDeleteDataStore] = useState(false);
    const [isVisibleEditDataStore, setIsVisibleEditDataStore] = useState(false);
    const [isVisibleEmbedWebsite, setIsVisibleEmbedWebsite] = useState(false);
    const [isVisibleMakePublic, setIsVisibleMakePublic] = useState(false);
    const [deleteId, setDeleteId] = useState<string>("");
    const [editId, setEditId] = useState<string>("");
    const [editItem, setEditItem] = useState();
    const [lastVisible, setLastVisible] = useState(null);
    const [pageCnt, setPageCnt] = useState(1);
    const { user } = useAuth();
    const [embedId, setEmbedId] = useState("");
    const [publicId, setPublicId] = useState("");
    const [datastore, setDatastore] = useState([
    ]);

    const pageSize = 10;

    const fetchData = async (flag = "fetch") => {
        setLoading(true);
        setDatastore([]);

        try {
            let q = query(
                collection(db, "file-search"),
                where("email", "==", user?.email),
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

    const addDataStore = (docStore: DateStore) => {
        setDatastore(store => [...store, docStore])
    }

    const handleEdit = (id: string) => {
        setEditId(id);

        datastore.map(item => {
            if (item.id === id) {
                setEditItem(item);
            }
        })

        setIsVisibleEditDataStore(true);
    }

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setIsVisibleDeleteDataStore(true)
    }

    const handleUpdateDatastore = (id, name, description) => {
        console.log(id, name)
        let data = datastore.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    name,
                    description
                }
            }
            else return item;
        })
        setDatastore(data);
    }

    const handleEmbedDialog = (id: string) => {
        setIsVisibleEmbedWebsite(true);
        setEmbedId(id)
    }

    const handlePublic = (id: string) => {
        setPublicId(id);
        setIsVisibleMakePublic(true)
    }

    const handleRefreshPublic = (id: string) => {

    }

    const togglePublic = async (id: string) => {
        try {
            const q = query(collection(db, "file-search"), where("assistantId", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.docs.map(doc => {
                const dt = doc.data();
                let data = datastore.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            public: !item.public
                        }
                    }
                    else return item;
                })
                setDatastore(data);
                updateDoc(doc.ref, { public: !dt?.public });
            });
            toast.success("Visible detail was updated successfully.")
        }
        catch (error) {
            let message = (error as Error).message;
            console.log(message);
        }
    }

    return (
        <div className='w-full px-3'>
            <div className='w-full mt-[23px]'>
                < div className='flex w-full justify-end pt-[10px]' >
                    <button onClick={() => setIsVisibleAddDataStore(true)} className='px-[20px] rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                        + Add DataStore
                    </button>
                </div >
            </div >

            <DataStoreAddDialog
                open={isVisibleAddDataStore}
                onClose={() => {
                    setIsVisibleAddDataStore(false);
                }}
                addDataStore={addDataStore}
            />

            <DataStoreDeleteDialog
                open={isVisibleDeleteDataStore}
                onClose={() => {
                    setIsVisibleDeleteDataStore(false);
                }}
                fetchStoreData={fetchData}
                id={deleteId}
            />

            <DataStoreEditDialog
                open={isVisibleEditDataStore}
                onClose={() => {
                    setIsVisibleEditDataStore(false);
                }}
                fetchStoreData={fetchData}
                id={editId}
                handleUpdateDatastore={handleUpdateDatastore}
                item={editItem}
            />

            <EmbedWebsiteDialog
                open={isVisibleEmbedWebsite}
                onClose={() => {
                    setIsVisibleEmbedWebsite(false);
                }}
                id={embedId}
            />

            <MakePublicDialog
                open={isVisibleMakePublic}
                onClose={() => {
                    setIsVisibleMakePublic(false);
                }}
                id={embedId}
                handleRefreshPublic={handleRefreshPublic}
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
                                Number Of Documents
                            </th>
                            <th scope="col" className="px-6 py-3 text-center sm:table-cell hidden">
                                Public
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && datastore && datastore?.map((item, index) => (
                            <tr className={`${index === 0 ? "" : "border-t"} text-black dark:text-white dark:bg-[#282c32] dark:border-[#222222]`}>
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-blue-100 text-center text-black dark:text-white">
                                    {(pageCnt - 1) * pageSize + index + 1}
                                </th>
                                <td className="px-6 text-center text-black dark:text-white">
                                    {item?.name}
                                </td>
                                <td className="px-6 text-center text-black dark:text-white sm:table-cell hidden">
                                    {item?.docCnt}
                                </td>
                                <td className="px-2 text-center text-black dark:text-white">
                                    <div className='w-full flex justify-center'>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={item?.public} className="sr-only peer" onChange={e => togglePublic(item?.id)} />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </td>
                                <td className="px-6 text-center text-black dark:text-white">
                                    <DropDownDatastoreAction id={item?.id} handleDelete={handleDelete} handleEdit={handleEdit} handleEmbedDialog={handleEmbedDialog} handlePublic={handlePublic} />
                                </td>
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
                        {!loading && datastore?.length === 0 && <tr className='mt-8 select-none text-center dark:bg-[#282c32] text-white items-center w-full'>
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

            {
                !loading && datastore && datastore.length > 0 && (<div className='w-full flex justify-center gap-2 mt-[20px]'>
                    <button onClick={() => fetchData("previous")} disabled={!lastVisible || pageCnt === 1} className='px-[20px] disabled:border-[#cccccc] disabled:hover:bg-gray-100 disabled:dark:border-[#333333] disabled:dark:hover:bg-gray-800 rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                        Previous
                    </button>
                    <button onClick={() => fetchData("next")} disabled={datastore.length < pageSize} className='px-[20px] disabled:border-[#cccccc] disabled:hover:bg-gray-100 disabled:dark:border-[#333333] disabled:dark:hover:bg-gray-800 rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                        Next
                    </button>
                </div>)
            }
        </div >
    )
}

export default FileSearchPage
