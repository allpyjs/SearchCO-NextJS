import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/signin");
      console.log("user logged out")
    } catch (error) {
      console.log(error.message)
    }
  }

  return { logout }
}
