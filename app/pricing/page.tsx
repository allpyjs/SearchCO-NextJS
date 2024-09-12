import type { NextPage } from "next";
import { Metadata } from "next";
import PricingPage from "@/components/Pricing";

export const metadata: Metadata = {
    title: "Search.co | Pricing Page",
    description: "This is  Pricing Page for Search.co",
};

const Page: NextPage = () => {
    return <PricingPage />;
};

export default Page;