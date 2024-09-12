import type { NextPage } from "next";
import { Metadata } from "next";
import PrivacyPolicyPage from "@/components/Privacy-Policy";

export const metadata: Metadata = {
  title: "Search.co | Privacy Policy Page",
  description: "This is  Privacy Policy for Search.co",
};

const Page: NextPage = () => {
  return <PrivacyPolicyPage />;
};

export default Page;