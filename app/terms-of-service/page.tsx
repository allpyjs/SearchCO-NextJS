import type { NextPage } from "next";
import { Metadata } from "next";
import TermsOfPolicyPage from "@/components/Terms-of-Policy";

export const metadata: Metadata = {
  title: "Search.co | Terms of Policy Page",
  description: "This is Terms of Policy for Search.co",
};

const Page: NextPage = () => {
  return <TermsOfPolicyPage />;
};

export default Page;