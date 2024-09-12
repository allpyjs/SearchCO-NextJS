import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { Prompt, SharedModalPrompt } from '@/types/prompt';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where, doc, serverTimestamp } from 'firebase/firestore';
import HomeContext from '@/contexts/homeContext';
import { Oval } from 'react-loader-spinner';
import { savePrompts } from '@/utils/app/prompts';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/authContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const SharedPromptViewDialog: FC<Props> = ({ open, onClose }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { user } = useAuth();

    const modalRef = useRef<HTMLDivElement>(null);

    const {
        state: {
            prompts,
            sharedPrompt,
        },
        dispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        if (sharedPrompt) {
            setName(sharedPrompt.name);
            setDescription(sharedPrompt.description);
            setContent(sharedPrompt.content);
        }
    }, [sharedPrompt])

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

    const handleUse = () => {
        dispatch({ field: "promptMessage", value: content });
        dispatch({ field: "isSharedPromptDialogOpen", value: false })
    }

    const handleSave = async () => {
        setIsSaving(true);

        let docId = uuidv4()
        const newPrompt: Prompt = {
            id: docId,
            name,
            description,
            content,
            folderId: null,
        };

        const newPromptTemp = {
            id: docId,
            name,
            description,
            content,
            folderId: null,
            createdAt: serverTimestamp()
        }
        const updatedPrompts = [...prompts, newPrompt];
        dispatch({ field: 'prompts', value: updatedPrompts });

        savePrompts(updatedPrompts);

        if (user) {
            try {
                await addDoc(collection(db, "history", user?.email!, "prompts"), { ...newPromptTemp });
            } catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        }

        toast.success("The prompt was successfully updated.")

        setIsSaving(false);
    }

    return (<>
        {open && <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50"
        >
            <div className="fixed inset-0 z-10 overflow-hidden">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                    />

                    <div
                        ref={modalRef}
                        className="dark:border-netural-400 inline-block max-h-[800px] transform overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[700px] w-full sm:max-w-lg sm:p-6 sm:align-middle"
                        role="dialog"
                    >
                        <div className="text-sm font-bold text-black dark:text-neutral-200">
                            Name
                        </div>
                        <input
                            className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
                            Description
                        </div>
                        <textarea
                            className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                            style={{ resize: 'none' }}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                        />

                        <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
                            Prompt
                        </div>
                        <textarea
                            className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                            style={{ resize: 'none' }}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={10}
                        />
                        <div className='flex w-full gap-2'>
                            <button
                                type="button"
                                className="mt-3 w-full rounded-md flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none border-gray-500 dark:border-gray-600 dark:border-opacity-50 dark:text-white hover:dark:bg-gray-700"
                                onClick={handleSave}
                            >
                                {isSaving && <Oval
                                    visible={true}
                                    height="20"
                                    width="30"
                                    color="#4fa94d"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />}
                                <span className='font-bold text-[20px]'> {isSaving ? "Saving" : "Save"} </span>
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full rounded-md flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none border-gray-500 dark:border-gray-600 dark:border-opacity-50 dark:text-white hover:dark:bg-gray-700"
                                onClick={handleUse}
                            >
                                <span className='font-bold text-[20px]'>Use</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >}
    </>
    );
};

