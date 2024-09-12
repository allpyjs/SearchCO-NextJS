import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import { WebDateStore } from '@/types/datastore';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    id: string;
    fetchStoreData: () => void;
    handleUpdateDatastore: (id: string, name: string, description: string) => void;
    item: WebDateStore;
}

const Dialog: FC<DialogProps> = ({ open, onClose, id, handleUpdateDatastore, item }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [isUpdating, setIsUpdating] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (open) {
            console.log(item)
            setName(item.name);
            setDescription(item.description);
        }
    }, [open])

    const handleUpdate = async e => {
        try {
            if (name === "") {
                toast.warning("Please fill the name field.");
                return;
            }

            setIsUpdating(true);

            try {
                const q = query(collection(db, "file-search"), where("assistantId", "==", id));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc: { ref: DocumentReference<unknown, DocumentData>; }) => {
                    handleUpdateDatastore(id, name, description);
                    await updateDoc(doc.ref, { name, description });
                });
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }

            setIsUpdating(false);
            toast.success("The File Data store information was updated successfully.");
            onClose();
        }
        catch (error) {
            let message = (error as Error).message;
            console.log(message);
        }
    }

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
                                <div className="text-3xl font-bold text-black dark:text-neutral-200">Edit a Datastore</div>

                                <div className='w-full mt-[20px]'>
                                    <label className="text-left text-neutral-700 dark:text-neutral-400">
                                        Datastore Name
                                    </label>

                                    <input
                                        type="text"
                                        name="openaiKey"
                                        placeholder="Enter datastore name."
                                        className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className='w-full mt-[10px]'>
                                    <label className="text-left text-neutral-700 dark:text-neutral-400">
                                        Description
                                    </label>

                                    <textarea
                                        rows={4}
                                        name="description"
                                        placeholder="Enter description here."
                                        className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                    onClick={handleUpdate}
                                >
                                    {isUpdating && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4fa94d"
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span className='font-bold text-[20px]'> {isUpdating ? "Updating" : "Update"} </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dialog;

