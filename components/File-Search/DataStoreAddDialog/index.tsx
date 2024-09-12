import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import { DateStore } from "@/types/datastore";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    addDataStore: (datstore: DateStore) => void;
}

const Dialog: FC<DialogProps> = ({ open, onClose, addDataStore }) => {
    const [name, setName] = useState("");
    const [instruction, setInstruction] = useState("You are helpful assistant.");
    const [description, setDescription] = useState("");
    const [visible, setVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const { user, setUser } = useAuth();

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
                toast.warning("Please fill the name field.");
                return;
            }

            setIsSaving(true);

            const response = await fetch("/api/assistants", {
                method: "POST",
                body: JSON.stringify({
                    type: "file",
                    name: name,
                    instruction,
                }),
            });

            const data = await response.json();

            // name, assistant id, ----------> users -> file-search
            await addDoc(collection(db, 'file-search'),
                {
                    email: user.email,
                    name,
                    assistantId: data.assistantId,
                    documents: [],
                    public: visible,
                    instruction,
                    description
                });

            if (visible) {
                await addDoc(collection(db, 'public-assistants'),
                    {
                        email: user.email,
                        name,
                        assistantId: data.assistantId,
                        description
                    });
            }

            addDataStore({ id: data.assistantId, name, docCnt: 0, description, public: visible });
            setIsSaving(false);
            toast.success("The File Data store was created successfully.");
            onClose();
        }
        catch (error) {
            let message = (error as Error).message;
            console.log(message);
        }
    }

    useEffect(() => {
        setName("");
    }, [])

    return (
        <>
            {open && (
                <div
                    className="z-1000 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="fixed inset-0 z-10 overflow-hidden">
                        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                                aria-hidden="true"
                            />

                            <div
                                ref={modalRef}
                                className="dark:border-netural-400 inline-block max-h-[600px] transform overflow-y-auto rounded-lg border border-gray-700  bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[600px] w-full sm:max-w-lg sm:p-6 sm:align-middle"
                                role="dialog"
                            >
                                <div className="text-3xl font-bold text-black dark:text-neutral-200">Add a Datastore</div>

                                <div className='w-full mt-[20px]'>
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
                                </div>

                                <div className='w-full mt-[10px]'>
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
                                </div>

                                <div className='w-full mt-[10px]'>
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
                                </div>

                                <div>
                                    <div className="flex items-center mb-4 gap-2 mt-[10px]">
                                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Public</label>
                                        <input checked={visible} onChange={e => setVisible(e.target.checked)} id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                    onClick={handleCreateDatestore}
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
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default Dialog;

