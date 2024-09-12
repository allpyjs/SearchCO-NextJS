import { FC, useContext, useEffect, useReducer, useRef, useState } from 'react';
import HomeContext from '@/contexts/homeContext';
import {
    IconTrash, IconMistOff, IconEye
} from '@tabler/icons-react';

import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/authContext';
import { toast } from 'react-toastify';
import { SharedPrompt } from "@/types/prompt";
import { Oval } from 'react-loader-spinner';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const SharedPromptDialog: FC<Props> = ({ open, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [sharedPrompts, setSharedPrompts] = useState<SharedPrompt[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const {
        state: {
            sharedPrompt
        },
        dispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        if (open && user) {
            const fetchSharedPrompts = async () => {
                setLoading(true);
                const q = query(collection(db, "history", user?.email, "sharedprompts"));
                try {
                    const sharedPromptsTemp: any = [];
                    const querySnapshot = await getDocs(q);
                    const prompts = querySnapshot.docs.map(doc => doc.data());

                    for (const prompt of prompts) {
                        let sourceName = null;
                        if (prompt.sourceRef) {
                            const userDoc = await getDoc(prompt.sourceRef);
                            let userData = userDoc.data();
                            let tmp: any = userData;
                            if (tmp) {
                                sourceName = tmp.userid;
                            }
                        }
                        sharedPromptsTemp.push({
                            ...prompt,
                            source: sourceName
                        });
                    }
                    setSharedPrompts(sharedPromptsTemp);
                } catch (error) {
                    console.error("Failed to fetch shared prompts:", error);
                }
                setLoading(false);
            };

            fetchSharedPrompts();
        }
    }, [open, user]);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener('mouseup', handleMouseUp);
            onClose();
        };

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [onClose]);

    const handleDeleteSharedPrompt = async (item: any) => {
        if (user) {
            try {
                const q = query(collection(db, "history", user.email, "sharedprompts"), where("id", "==", item.id));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc: any) => {
                    await deleteDoc(doc.ref);
                });
                let data = sharedPrompts.filter(it => !(it.id === item.id))
                setSharedPrompts(data);
                toast.success("The shared prompt was successfully deleted.")
            }
            catch (err) {
                console.log((err as Error).message)
            }
        }
    }

    const handleSelect = (item: any) => {
        console.log(item)
        dispatch({ field: "sharedPrompt", value: { name: item.name, description: item.description, content: item.content } })
        dispatch({ field: "isSharedPromptDialogOpen", value: true })
        onClose()
    }

    if (!open) {
        return <></>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50">
            <div className="fixed inset-0 z-10 overflow-hidden">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                    />

                    <div
                        ref={modalRef}
                        className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[400px] w-full sm:max-w-[800px] sm:p-6 sm:align-middle"
                        role="dialog"
                    >
                        <div className="text-3xl pb-4 font-bold text-black dark:text-neutral-200">
                            Shared Prompts
                        </div>

                        <div className='max-h-[550px]'>
                            <table className='bg-gray-100 text-black border-[#000000] dark:text-white dark:border-[#FFFFFF] dark:bg-gray-700 rounded-[8px] w-full'>
                                <thead>
                                    <tr>
                                        <th className='text-left py-2 px-4'>ID</th>
                                        <th className='text-left py-2 px-4'>Prompt Name</th>
                                        <th className='text-left py-2 px-4'>Source</th>
                                        <th className='text-left py-2 px-2 text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading && sharedPrompts?.map((item, index) => (
                                        <tr key={item.id} className="cursor-pointer hover:bg-gray-200 dark:border-[#FFFFFF] dark:hover:bg-gray-600" >
                                            <td className="py-2 px-4">{index + 1}</td>
                                            <td className="py-2 px-4">{item?.source}</td>
                                            <td className="py-2 px-4">{item?.source}</td>
                                            <td className="py-2 px-4 flex gap-4 justify-center" ><IconEye onClick={(e) => handleSelect(item)} size={20} /> <IconTrash onClick={(e) => handleDeleteSharedPrompt(item)} size={20} /></td>
                                        </tr>
                                    ))}
                                    {loading && <tr className='mt-8 select-none text-center text-white opacity-50 items-center w-full'>
                                        <td colSpan={4}>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[14px] leading-normal">
                                                    <div className='mb-3 mt-3'>
                                                        <Oval
                                                            visible={true}
                                                            height="30"
                                                            width="100"
                                                            color="#4A6CF7"
                                                            secondaryColor='#3C56C0'
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                        />
                                                    </div>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>}
                                    {!loading && sharedPrompts.length === 0 && <tr className='mt-8 select-none text-center text-white opacity-50 items-center w-full'>
                                        <td colSpan={4}>
                                            <div className="flex flex-col items-center text-black dark:text-white">
                                                <IconMistOff className="mx-auto mb-3" />
                                                <span className="text-[14px] leading-normal">
                                                    No data.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

