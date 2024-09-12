import type { NextPage } from "next";
import { Metadata } from "next";
import Users from "@/components/Users";

export const metadata: Metadata = {
    title: "Search.co | Users Page",
    description: "This is Users Page for Search.co",
};

const Page: NextPage = () => {
    return <Users />;
};

export default Page;