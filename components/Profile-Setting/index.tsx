"use client";

import { db } from '@/config/firebase';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/authContext';
import { Oval } from 'react-loader-spinner';

const ProfileSetting = () => {
    const [firstloading, setFirstloading] = useState(true);
    const [userid, setUserid] = useState<string>("");
    const [openaiKey, setOpenaiKey] = useState<string>("");
    const [geminiKey, setGeminiKey] = useState<string>("");
    const [perplexityKey, setPerplexityKey] = useState<string>("");
    const [tavilyKey, setTavilyKey] = useState<string>("");

    const [isUseridSaving, setIsUseridSaving] = useState<boolean>(false);
    const [isOpenaiKeySaving, setIsOpenaiKeySaving] = useState<boolean>(false);
    const [isGeminiKeySaving, setIsGeminiKeySaving] = useState<boolean>(false);
    const [isPerplexityKeySaving, setIsPerplexityKeySaving] = useState<boolean>(false);
    const [isTavilyKeySaving, setIsTavilyKeySaving] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const useridRef = useRef(null);

    const { user, setUser } = useAuth();

    useEffect(() => {

        if (user && firstloading) {
            setLoading(true);
            setFirstloading(false);

            const fetchUserInfo = async () => {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        toast.error("Please input userid.")
                        useridRef.current.focus();

                        return;
                    }

                    for (const doc of querySnapshot.docs) {
                        let dt = doc.data();

                        setUserid(dt?.userid || "");
                        setPerplexityKey(dt?.perplexityKey || "");
                        setOpenaiKey(dt?.openaiKey || "");;
                        setGeminiKey(dt?.geminiKey || "");
                        setTavilyKey(dt?.tavilyKey || "");
                    }
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
                setLoading(false);
            }
            fetchUserInfo();
        }
    }, [user])

    const onUseridSave = async e => {
        if (userid === "") {
            toast.error("Please fill the userid field.")
            setIsUseridSaving(false);
            return;
        }

        try {
            setIsUseridSaving(true);

            const q1 = query(collection(db, "users"), where("userid", "==", userid));
            try {
                const querySnapshot1 = await getDocs(q1);
                if (querySnapshot1.empty) {
                    const q = query(collection(db, "users"), where("email", "==", user.email));

                    try {
                        const querySnapshot = await getDocs(q);

                        for (const doc of querySnapshot.docs) {
                            await updateDoc(doc.ref, { userid });
                        }
                        toast.success("Your name was saved successfully.")
                        setUser({ ...user, userid });
                    }
                    catch (error) {
                        let message = (error as Error).message;
                        console.log(message);
                    }
                }
                else {
                    toast.warn("The name already exits. Please input the other name.");
                }
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setIsUseridSaving(false);
    }

    const onOpenaiKeySave = async e => {
        if (openaiKey === "") {
            toast.error("Please fill the OpenAI field.")
            setIsOpenaiKeySaving(false);
            return;
        }

        try {
            setIsOpenaiKeySaving(true);

            const body = JSON.stringify({
                type: "chatgpt",
                key: openaiKey
            });
            const controller = new AbortController();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
                body,
            });

            if (!response.ok) {
                console.log(response);
                if (response.status === 500) {
                    toast.error("Internal Server Error");
                } else {
                    toast.error("An unknown error occurred");
                }

                setIsOpenaiKeySaving(false);
                return;
            }

            try {

                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);

                    for (const doc of querySnapshot.docs) {
                        await updateDoc(doc.ref, { openaiKey });
                    }
                    toast.success("Your Openai Key was saved successfully.")
                    setUser({ ...user, openaiKey });
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }

        setIsOpenaiKeySaving(false);
    }

    const onGeminiSave = async e => {
        if (geminiKey === "") {
            toast.error("Please fill the Google Gemini Key field.")
            setIsGeminiKeySaving(false);
            return;
        }

        try {
            setIsGeminiKeySaving(true);
            const q = query(collection(db, "users"), where("email", "==", user.email));
            try {
                const querySnapshot = await getDocs(q);

                for (const doc of querySnapshot.docs) {
                    await updateDoc(doc.ref, { geminiKey });
                }
                toast.success("Your Google Gemini Key was saved successfully.")
                setUser({ ...user, geminiKey });
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setIsGeminiKeySaving(false);
    }

    const onPerplexitySave = async e => {
        if (perplexityKey === "") {
            toast.error("Please fill the Perplexity Key field.")
            setIsPerplexityKeySaving(false);
            return;
        }
        try {
            setIsPerplexityKeySaving(true);
            const q = query(collection(db, "users"), where("email", "==", user.email));
            try {
                const querySnapshot = await getDocs(q);

                for (const doc of querySnapshot.docs) {
                    await updateDoc(doc.ref, { perplexityKey });
                }
                toast.success("Your Perplexity Key was saved successfully.")
                setUser({ ...user, perplexityKey });
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setIsPerplexityKeySaving(false);
    }

    const onTavilySave = async e => {
        if (tavilyKey === "") {
            toast.error("Please fill the Google Gemini Key field.")
            setIsTavilyKeySaving(false);
            return;
        }

        try {
            setIsTavilyKeySaving(true);
            const q = query(collection(db, "users"), where("email", "==", user.email));
            try {
                const querySnapshot = await getDocs(q);

                for (const doc of querySnapshot.docs) {
                    await updateDoc(doc.ref, { tavilyKey });
                }
                toast.success("Your Tavily Key was saved successfully.")
                setUser({ ...user, tavilyKey });
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setIsTavilyKeySaving(false);
    }

    return (
        <div className='w-full px-3'>
            <div className='pt-[20px]'>
                <button className='px-[20px] rounded-md border-[1px] mb-[10px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700'>
                    Manage Subscription Plan
                </button>

                <div className='border-[1px] w-full lg:w-1/2 border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                    <div className='w-full flex justify-center text-[30px] mb-[15px] font-bold'>
                        Profile
                    </div>
                    {loading ?
                        <div className='w-full justify-center flex' >
                            <Oval
                                visible={true}
                                height="20"
                                width="30"
                                color="#4A6CF7"
                                secondaryColor='#3C56C0'
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                        : <div className='w-full flex items-center gap-3' >
                            <label className="text-left text-neutral-700 dark:text-neutral-400">
                                User ID
                            </label>
                            <input
                                type="text"
                                name="userid"
                                placeholder="Enter your User ID"
                                className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                value={userid}
                                onChange={(e) =>
                                    setUserid(e.target.value)
                                }
                            />
                            <button className='px-[20px] rounded-md items-center border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700' disabled={userid === ""} onClick={onUseridSave} >
                                {isUseridSaving && <Oval
                                    visible={true}
                                    height="20"
                                    width="30"
                                    color="#4A6CF7"
                                    secondaryColor='#3C56C0'
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />}
                                <span>{!isUseridSaving ? "Save" : "Saving"}</span>
                            </button>
                        </div>}
                </div>

                <div className='border-[1px] w-full lg:w-1/2 border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-[20px]'>
                    <div className='w-full flex justify-center text-[30px] mb-[15px] font-bold'>
                        LLM Keys
                    </div>
                    {loading ?
                        <div className='w-full justify-center flex' >
                            <Oval
                                visible={true}
                                height="20"
                                width="30"
                                color="#4A6CF7"
                                secondaryColor='#3C56C0'
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div> :
                        <>
                            <div className='w-full flex items-center gap-3' >
                                <label className="text-left text-neutral-700 dark:text-neutral-400 w-[20%]">
                                    OpenAI Key
                                </label>
                                <input
                                    type="text"
                                    name="openaiKey"
                                    placeholder="Enter your OpenAI Key."
                                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                    value={openaiKey}
                                    onChange={(e) =>
                                        setOpenaiKey(e.target.value)
                                    }
                                    ref={useridRef}
                                />
                                <button className='px-[20px] rounded-md items-center border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700' disabled={userid === ""} onClick={onOpenaiKeySave} >
                                    {isOpenaiKeySaving && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4A6CF7"
                                        secondaryColor='#3C56C0'
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span>{!isOpenaiKeySaving ? "Save" : "Saving"}</span>
                                </button>
                            </div>
                            <div className='w-full flex items-center gap-3 mt-4' >
                                <label className="text-left text-neutral-700 dark:text-neutral-400 w-[20%]">
                                    Gemini Key
                                </label>
                                <input
                                    type="text"
                                    name="geminiKey"
                                    placeholder="Enter your Gemini Key."
                                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                    value={geminiKey}
                                    onChange={(e) =>
                                        setGeminiKey(e.target.value)
                                    }
                                />
                                <button className='px-[20px] rounded-md border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700' disabled={geminiKey === ""} onClick={onGeminiSave}>
                                    {isGeminiKeySaving && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4A6CF7"
                                        secondaryColor='#3C56C0'
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span>{!isGeminiKeySaving ? "Save" : "Saving"}</span>
                                </button>
                            </div>
                            <div className='w-full flex items-center gap-3 mt-4' >
                                <label className="text-left text-neutral-700 dark:text-neutral-400 w-[20%]">
                                    Perplexity Key
                                </label>
                                <input
                                    type="name"
                                    name="perplexityKey"
                                    placeholder="Enter your Google Perplexity Key."
                                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                    value={perplexityKey}
                                    onChange={(e) =>
                                        setPerplexityKey(e.target.value)
                                    }
                                />
                                <button className='px-[20px] rounded-md border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700' disabled={perplexityKey === ""} onClick={onPerplexitySave}>
                                    {isPerplexityKeySaving && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4A6CF7"
                                        secondaryColor='#3C56C0'
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span>{!isPerplexityKeySaving ? "Save" : "Saving"}</span>
                                </button>
                            </div>
                            <div className='w-full flex items-center gap-3 mt-4' >
                                <label className="text-left text-neutral-700 dark:text-neutral-400 w-[20%]">
                                    Tavily Key
                                </label>
                                <input
                                    type="name"
                                    name="perplexityKey"
                                    placeholder="Enter your Tavily Key."
                                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                                    value={tavilyKey}
                                    onChange={(e) =>
                                        setTavilyKey(e.target.value)
                                    }
                                />
                                <button className='px-[20px] rounded-md border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700' disabled={tavilyKey === ""} onClick={onTavilySave}>
                                    {isTavilyKeySaving && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4A6CF7"
                                        secondaryColor='#3C56C0'
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span>{!isTavilyKeySaving ? "Save" : "Saving"}</span>
                                </button>
                            </div>
                        </>}
                </div>
            </div>
        </div >
    )
}

export default ProfileSetting
