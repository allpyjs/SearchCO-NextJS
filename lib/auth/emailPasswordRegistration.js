import { useState } from "react";
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export const useEmailPasswordRegistration = () => {
  const router = useRouter();
  const [errorEmailPasswordRegistration, setErrorEmailPasswordRegistration] =
    useState(null);
  const [isPendingEmailPasswordRegistration, setIsPendingEmailRegistration] =
    useState(false);

  const emailPasswordRegistration = async (email, password) => {
    setErrorEmailPasswordRegistration(null);
    setIsPendingEmailRegistration(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res.user) {
        return;
      }
      router.push("/profile-setting");
    } catch (error) {
      setErrorEmailPasswordRegistration(error.code);
      await signOut(auth);
    } finally {
      setIsPendingEmailRegistration(false);
    }
  };

  return {
    emailPasswordRegistration,
    errorEmailPasswordRegistration,
    isPendingEmailPasswordRegistration,
  };
};
