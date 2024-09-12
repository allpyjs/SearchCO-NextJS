import type { NextPage } from "next";

import ProfileSetting from "@/components/Profile-Setting";
import { useContext } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search.co | Profile Setting Page",
    description: "This is  Profile Setting  Page for Search.co",
};

const Page: NextPage = () => {
    return <ProfileSetting />
};

export default Page;