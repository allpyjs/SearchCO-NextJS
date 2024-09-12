import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { db } from '@/config/firebase';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/authContext';
import HomeContext from '@/contexts/homeContext';
import { Oval } from 'react-loader-spinner'
import { useRouter } from 'next/navigation';

interface UseridDialogProps {
    open: boolean;
    onClose: () => void;
}

export const UseridDialog: FC<UseridDialogProps> = ({ open, onClose }) => {
    const [userid, setUserid] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();
    const router = useRouter();

    const {
        dispatch,
    } = useContext(HomeContext);

    const handleSaveProfileInformation = async () => {
        if (userid?.length < 4) {
            toast.warn("Please input the name longer than 3 letters.");
            return;
        }
        try {
            setIsSaving(true);
            const q = query(collection(db, "users"), where("userid", "==", userid));
            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    addDoc(collection(db, 'users'),
                        {
                            email: user.email,
                            userid,
                            openaiKey: "",
                            pplxKey: "",
                            geminiKey: "",
                            freeCredit: 10,
                            role: "user",
                        });

                    dispatch({ field: "isUseridDialogOpen", value: false });
                    setUser({
                        ...user,
                        name
                    })
                    toast.success("profile was created successfully.")
                    onClose();
                    router.push("/profile-setting");
                }
                else {
                    toast.warn("The user id already exits. Please input the other user id.");
                    setUserid("");
                }
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setIsSaving(false);
    }

    return (
        <>
            {open && (
                <div
                    className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-0"
                >
                    <div className="fixed inset-0 z-10 overflow-hidden">
                        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                                aria-hidden="true"
                            />

                            <div
                                ref={modalRef}
                                className="custom-scrollbar dark:border-netural-400 inline-block max-h-[700px] transform overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[500px] w-full sm:max-w-[500px] sm:p-6 sm:align-middle"
                                role="dialog"
                            >
                                <div className="text-3xl font-bold text-black dark:text-neutral-200">Profile Completion</div>

                                <div className='w-full flex mt-[40px] font-bold'>Please complete your profile here.</div>
                                <input
                                    className="mt-[5px] border-stroke dark:text-[#eeeeee] dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                    placeholder="User ID *"
                                    value={userid}
                                    onChange={e => setUserid(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                                    onClick={handleSaveProfileInformation}
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