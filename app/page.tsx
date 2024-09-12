import ChatgptPage from "@/components/Chatgpt";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import GoogleSearchPage from "@/components/google-search";
import Hero from "@/components/Hero";
import HomePage from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search.co | GPT Search Engine",
  description: "Enhance your personal and business searches with Search.co, powered by GPT!",
};

export default function Home() {

  return (
    <>
      <GoogleSearchPage />
    </>
  );
}
