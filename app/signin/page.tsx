import type { NextPage } from "next";
import SigninPage from "@/components/Signin";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Search.co | Signin Page",
  description: "This is  Signin Page for Search.co",
};

const Page: NextPage = () => {
  return <SigninPage />;
};

export default Page;