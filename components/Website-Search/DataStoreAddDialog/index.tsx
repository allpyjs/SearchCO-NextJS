"use client";
import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import axios from 'axios';
import { WebDateStore } from '@/types/datastore';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    addDataStore: (datstore: WebDateStore) => void;
}

function isValidUrl(string) {
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return regex.test(string);
}

const Dialog: FC<DialogProps> = ({ open, onClose, addDataStore }) => {
    const [instruction, setInstruction] = useState("You are helpful assistant for website.");
    const [description, setDescription] = useState("");
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();
    const [url, setUrl] = useState("");
    const [step, setStep] = useState(2);
    const [taskID, setTaskID] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [content, setContent] = useState("");

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

    const handleCreateDatestore = async e => {
        try {
            if (name === "") {
                toast.warning("Please fill in the name field.");
                return;
            }

            setIsSaving(true);

            // Create a new assistant
            const response = await fetch("/api/assistants", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: "website",
                    name: name,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create assistant: ${response.statusText}`);
            }
            const data = await response.json();


            // Download the file
            const response1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/download/${taskID}`);
            if (!response1.ok) {
                throw new Error(`Failed to download file: ${response1.statusText}`);
            }
            const blob = await response1.blob();
            const formData = new FormData();
            formData.append('file', blob, 'store.txt');
            formData.append("id", data.assistantId);

            // Upload the file
            const response2 = await fetch("/api/assistants/files", {
                method: "POST",
                body: formData,
            });
            if (!response2.ok) {
                throw new Error(`Failed to upload file: ${response2.statusText}`);
            }

            // Update Firestore
            await addDoc(collection(db, 'website-search'), {
                email: user.email,
                name,
                assistantId: data.assistantId,
                url,
                description,
                public: visible
            });

            // Local state updates
            addDataStore({ id: data.assistantId, name, url, description, public: visible });
            setStep(1);
            setUrl("");
            setIsSaving(false);
            toast.success("The Web URL Data store was created successfully.");
            onClose();
        } catch (error) {
            console.error(error);
            setIsSaving(false);
            toast.error(`Error: ${error.message || 'Unknown error'}`);
        }
    }



    useEffect(() => {
        if (open) {
            setStep(1);
            setUrl("");
            setProgress(0)
        }
    }, [open])

    const handleScrape = async () => {
        if (url === "") {
            toast.warning("Please fill url.");
            return;
        }
        if (!isValidUrl(url)) {
            toast.warning("Please input url correctly.");
            return;
        }
        try {
            setIsScraping(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/start-scrape`, { url });
            setTaskID(response.data.task_id);
            setProgress(0);
            pollProgress(response.data.task_id);
        } catch (err) {
            setError('Failed to start scraping: ' + err.message);
        }
    };

    const pollProgress = (taskId) => {
        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/task-progress/${taskId}`);
                if (data.progress !== undefined) {
                    setProgress(data.progress);
                    if (data.progress === 100) {
                        clearInterval(interval);
                        setIsScraping(false);
                        setProgress(100);
                        setStep(2);
                    }
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (err) {
                clearInterval(interval);
                setError('Error fetching progress: ' + err.message);
            }
        }, 2000);
    };

    return (
        <>
            {open && (
                <div
                    className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="fixed inset-0 z-10 overflow-hidden">
                        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                                aria-hidden="true"
                            />

                            <div
                                ref={modalRef}
                                className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-700  bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[600px] w-full sm:max-w-lg sm:p-6 sm:align-middle"
                                role="dialog"
                            >
                                <div className="text-3xl font-bold text-black dark:text-neutral-200">Add a URL Store</div>
                                {step === 1 && <div className='w-full mt-[20px]'>
                                    <label className="text-left text-neutral-700 dark:text-neutral-400">
                                        URL
                                    </label>

                                    <input
                                        type="text"
                                        name="url"
                                        placeholder="Enter source URL here."
                                        className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={url}
                                        onChange={(e) =>
                                            setUrl(e.target.value)
                                        }
                                    />
                                </div>}

                                {step === 2 && <div className='w-full mt-[20px]'>
                                    <label className="text-left text-neutral-700 dark:text-neutral-400">
                                        Datastore Name
                                    </label>

                                    <input
                                        type="text"
                                        name="openaiKey"
                                        placeholder="Enter datastore name."
                                        className="mt-[5px] border-stroke dark:text-[#eeeeee] dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>}

                                {step === 2 && <div className='w-full mt-[10px]'>
                                    <label className="text-left text-neutral-700 dark:text-neutral-400">
                                        Instruction
                                    </label>

                                    <textarea
                                        rows={4}
                                        name="openaiKey"
                                        placeholder="Enter datastore name."
                                        className="mt-[5px] border-stroke dark:text-[#eeeeee] dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={instruction}
                                        onChange={(e) =>
                                            setInstruction(e.target.value)
                                        }
                                    />
                                </div>}

                                {step === 2 && <div className='w-full mt-[10px]'>
                                    <label className="text-left text-neutral-700 dark:text-neutral-400">
                                        Description
                                    </label>

                                    <textarea
                                        rows={4}
                                        name="openaiKey"
                                        placeholder="Enter description here."
                                        className="mt-[5px] border-stroke dark:text-[#eeeeee] dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </div>}

                                {step === 2 &&
                                    <div>
                                        <div className="flex items-center mb-4 gap-2 mt-[10px]">
                                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
                                            <input checked={visible} onChange={e => setVisible(e.target.checked)} id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        </div>
                                    </div>
                                }

                                {
                                    step === 1 && <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-[20px]">
                                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: progress + "%" }}> {progress}%</div>
                                    </div>
                                }

                                {step === 1 && <button
                                    type="button"
                                    className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                    onClick={handleScrape}
                                    disabled={isScraping}
                                >
                                    {isScraping && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4fa94d"
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span className='font-bold text-[20px]'> {isScraping ? "Scraping" : "Scrape"} </span>
                                </button>}

                                {step === 2 && <button
                                    type="button"
                                    className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                    onClick={handleCreateDatestore}
                                // disabled={isSaving}
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
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dialog;

