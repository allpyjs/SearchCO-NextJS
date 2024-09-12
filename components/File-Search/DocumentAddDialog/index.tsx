import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import styles from "@/components/assistant/file-viewer.module.css";
import { Document } from '@/types/datastore';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    addDocument: (newDocument: Document) => void;
    id: string;
}

function splitFilename(filename) {
    const result = filename.match(/^(.+)(\.\w+)$/);
    if (result) {
        return {
            name: result[1],
            extension: result[2]
        };
    } else {
        return {
            name: filename,
            extension: ''
        };
    }
}

const Dialog: FC<DialogProps> = ({ open, onClose, addDocument, id }) => {
    const [file, setFile] = useState(null);
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

    useEffect(() => {
        if (open) {
            setFile(null);
        }
    }, [open])

    const handleFileUpload = async (event) => {
        setFile(event.target.files[0]);
    };

    const handleSave = async e => {
        if (!file) {
            toast.warning("Please select file to upload correctly.");
            return;
        }
        try {
            setIsSaving(true);
            const data = new FormData();
            data.append("file", file);
            data.append("id", id);

            const response = await fetch("/api/assistants/files", {
                method: "POST",
                body: data,
            });

            try {
                const split = splitFilename(file.name);
                const data = await response.json();
                const fileId = data.fileId;

                try {
                    const q = query(collection(db, "file-search"), where("assistantId", "==", id));

                    const querySnapshot = await getDocs(q);
                    querySnapshot.docs.map(async (doc) => {
                        let dt = doc.data()
                        let newDocument = {
                            fileId,
                            name: split.name,
                            type: split.extension
                        }
                        addDocument({
                            id: fileId,
                            name: split.name,
                            type: split.extension
                        });

                        console.log(dt.documents);
                        await updateDoc(doc.ref, { documents: [...dt.documents, newDocument] });
                    });
                    toast.success("Your document was added successfully.")
                    onClose();
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
            } catch (error) {
                console.error("Failed to add document:", error);
            }
        } catch (error) {
            console.error("Failed to add document:", error);
        }
        finally {
            setIsSaving(false);
            onClose();
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
                                <div className="text-3xl font-bold text-black dark:text-neutral-200 mb-[10px]">Add a Document</div>

                                <input
                                    type="file"
                                    id="file-upload"
                                    name="file-upload"
                                    className={styles.fileUploadInput}
                                    onChange={handleFileUpload}
                                />

                                <label htmlFor="file-upload" className={styles.fileUploadBtn} >
                                    Attach files
                                </label>
                                <div className='mt-[10px]'>
                                    {file && (
                                        <div>
                                            {file.name}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dialog;

