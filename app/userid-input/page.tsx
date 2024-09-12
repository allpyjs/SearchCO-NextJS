"use client";

import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { auth } from "@/config/firebase";

const NameInputPage = () => {
    const [userid, setUserid] = useState<string>("");
    const { user, setUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!auth?.currentUser) {
            router.push("/signin");
        }
    }, [router])

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        router.push("/profile-setting");
                    }
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
            }

            fetchData();
        }
    }, [user])

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
                            freeCredit: 10,
                            role: "user",
                        });
                    setUser({
                        ...user,
                        userid
                    })
                    router.push("/profile-setting");
                    toast.success("profile was created successfully.")
                }
                else {
                    toast.warn("The userid already exits. Please input the other userid.");
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
            <section className="flex h-screen justify-center items-center">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4">
                            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                                <h3 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                                    Please input your unique user id.
                                </h3>
                                <div className="mb-8">
                                    <label
                                        htmlFor="email"
                                        className="mb-3 block text-sm text-dark dark:text-white"

                                    >
                                        Unique user id
                                    </label>
                                    <input
                                        type="name"
                                        name="text"
                                        placeholder="Enter your unique user id."
                                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                        value={userid}
                                        onChange={e => setUserid(e.target.value)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <button className="gap-2 shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90" onClick={handleSaveProfileInformation}>
                                        {isSaving && <Oval
                                            visible={true}
                                            height="20"
                                            width="30"
                                            color="#4A6CF7"
                                            secondaryColor='#3C56C0'
                                            ariaLabel="oval-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                        />}
                                        <span>Save User Information</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NameInputPage;
