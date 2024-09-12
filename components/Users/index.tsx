"use client";
import { db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/authContext';
import { IconDownload, IconMistOff } from '@tabler/icons-react';
import { Oval } from 'react-loader-spinner';
import { userInfo } from 'os';
import HomeContext from '@/contexts/homeContext';

type User = {
    email: string;
    userid: string;
}

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [usersInfo, setUsersInfo] = useState<User[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchUsers = async () => {
                const querySnapshot = await getDocs(collection(db, "users"));
                const data = querySnapshot.docs.map(doc => {
                    const dt = doc.data();
                    return {
                        email: dt.email,
                        userid: dt.userid
                    }
                });
                setLoading(false)
                setUsersInfo(data);
            }
            fetchUsers();
        }
    }, [user])

    const convertToCSV = (arr: string[]) => {
        const array = arr.map(email => [email]);
        const csvContent = array.map(e => e.join(",")).join("\n");
        return csvContent;
    };

    const handleDownload = () => {
        const emails = usersInfo.map(user => user.email);

        console.log(emails);

        const csvData = convertToCSV(emails);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'emails.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className='w-full px-3'>
            <div className='w-full flex justify-end items-center mb-[10px] mt-[20px]'>
                {user?.role === "admin" && <button
                    type="button"
                    className="rounded-full flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                    onClick={handleDownload}
                >
                    <IconDownload size={18} />
                </button>}
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                    <thead className="text-xs text-white uppercase bg-[#4a6cf7] dark:text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                                No
                            </th>
                            {user?.role === "admin" &&
                                <th scope="col" className="px-6 py-3 text-center">
                                    Email
                                </th>}
                            <th scope="col" className="px-6 py-3 text-center">
                                User ID
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && usersInfo && usersInfo?.map((item, index) => (
                            <tr key={index} className={`${index === 0 ? "" : "border-t"} text-black dark:text-white dark:bg-[#333333] dark:border-[#222222]`}>
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-blue-100 text-center text-black dark:text-white">
                                    {index + 1}
                                </th>
                                {user?.role === "admin" && <td className="px-6 py-4 text-center text-black dark:text-white">
                                    {item?.email}
                                </td>}
                                <td className="px-6 py-4 text-center text-black dark:text-white">
                                    {item?.userid}
                                </td>
                            </tr>
                        ))}
                        {loading && <tr className='mt-8 select-none text-center text-white opacity-50 items-center w-full'>
                            <td colSpan={4} className='dark:bg-[#333333]'>
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
                        {!loading && usersInfo?.length === 0 && <tr className='mt-8 select-none text-center dark:bg-[#333333] text-white opacity-50 items-center w-full'>
                            <td colSpan={4}>
                                <div className="flex flex-col items-center text-black dark:text-white py-[10px]">
                                    <IconMistOff className="mx-auto mb-3" />
                                    <span className="text-[14px] leading-normal">
                                        No Data
                                    </span>
                                </div>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Page
