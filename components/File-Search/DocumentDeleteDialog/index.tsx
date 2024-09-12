import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    handleRefreshDelete: (id: string) => void;
    id: string;
    fileId: string;
}

const Dialog: FC<DialogProps> = ({ open, onClose, handleRefreshDelete, id, fileId }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await fetch("/api/assistants/files", {
                method: "DELETE",
                body: JSON.stringify({ id, fileId }),
            });

            const storeRef = collection(db, "file-search");
            const q = query(storeRef, where("assistantId", "==", id));
            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.docs.map(async (doc) => {
                    let dt = doc.data()

                    let newDocuments = dt.documents?.filter(item => item.fileId !== fileId);

                    await updateDoc(doc.ref, { documents: newDocuments });
                });
                handleRefreshDelete(fileId);
                toast.success("File Data store was deleted successfully.")
                onClose();
            } catch (error) {
                console.error("Failed to delete file data store:", error);
            }
        }
        catch (error) {
            console.error("Failed to delete file data store:", error);
        }
        finally {
            setIsDeleting(false)
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
                                <div className="text-3xl font-bold text-black dark:text-neutral-200 mb-[20px]">Delete a Document</div>
                                <div>Will you really delete the document?</div>
                                <div className='w-full flex gap-2'>
                                    <button
                                        type="button"
                                        className="mt-[20px] flex-1 px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                        onClick={() => onClose()}
                                    >
                                        <span className='font-bold text-[20px]'>Cancel</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-[20px] flex-1 px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                        onClick={() => handleDelete()}
                                    >
                                        {isDeleting && <Oval
                                            visible={true}
                                            height="20"
                                            width="30"
                                            color="#4fa94d"
                                            ariaLabel="oval-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                        />}
                                        <span className='font-bold text-[20px]'> {isDeleting ? "Deleting" : "Delete"} </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default Dialog;

