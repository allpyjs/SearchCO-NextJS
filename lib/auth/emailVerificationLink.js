import { useState } from "react";
import { auth } from "@/config/firebase";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

export const useEmailVerification = () => {
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [isEmailVerificationPending, setIsEmailVerificationPending] =
    useState(false);
  const [errorVerificationLink, setErrorVerificationLink] = useState(null);

  const sendEmailVerificationLink = async () => {
    setIsEmailVerificationPending(true);

    try {
      const user = auth.currentUser;

      if (user) {
        await sendEmailVerification(user);
        setIsEmailVerificationSent(true);
      } else {
        setErrorVerificationLink("No user is currently logged in.");
      }
    } catch (error) {
      setErrorVerificationLink(
        "Error sending verification email : " + error.message
      );
    } finally {
      setIsEmailVerificationPending(false);
    }
  };

  return {
    isEmailVerificationSent,
    isEmailVerificationPending,
    errorVerificationLink,
    sendEmailVerificationLink,
  };
};