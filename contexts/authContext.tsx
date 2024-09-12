import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

import {
    onAuthStateChanged,
} from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

import SpinPage from '@/components/Spin'

const AuthContext = createContext<any>({})
export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null)
    const router = useRouter();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (pathname.includes("chatbot-iframe")) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            userid: "",
                            role: "user",
                            freeCredit: 10,
                            openaiKey: "",
                            pplxKey: "",
                            geminiKey: "",
                            openaiKeyEnable: false,
                            pplxKeyEnable: false,
                            geminiKeyEnable: false,
                        })
                    }
                    else {
                        for (const doc of querySnapshot.docs) {
                            let dt = doc.data();
                            setUser({
                                uid: user?.uid,
                                email: user?.email,
                                userid: dt.userid,
                                role: dt.role,
                                freeCredit: dt.freeCredit,
                                openaiKey: dt.openaiKey,
                                pplxKey: dt.pplxKey,
                                geminiKey: dt.geminiKey,
                                openaiKeyEnable: dt.openaiKey === "" ? false : true,
                                pplxKeyEnable: dt.pplxKey === "" ? false : true,
                                geminiKeyEnable: dt.geminiKey === "" ? false : true,
                            })
                        }
                    }
                }
                catch (error) {
                    let message = (error as Error).message;
                    console.log(message);
                }
            } else {
                setUser(null)
            }
            setLoading(false);
        });

        return () => unsubscribe()
    }, [router])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {pathname.includes("chatbot-iframe") ? children : loading ? <SpinPage /> : children}
        </AuthContext.Provider>
    )
}
