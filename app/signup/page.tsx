import type { NextPage } from "next";
import { Metadata } from "next";
import SignupPage from "@/components/Signup";

export const metadata: Metadata = {
  title: "Search.co | Signup Page",
  description: "This is  Signup Page for Search.co",
};


const Page: NextPage = () => {
  return <SignupPage />;
};

export default Page;
