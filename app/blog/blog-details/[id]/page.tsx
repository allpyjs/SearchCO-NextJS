import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import Image from "next/image";

import BlogDetailPage from "@/components/Blog/BlogDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Details Page | Free Next.js Template for Startup and SaaS",
  description: "This is Blog Details Page for Startup Nextjs Template",
  // other metadata
};

export interface PageProps {
  params: {
    id: string
  }
}


const BlogDetailsPage = ({ params }: PageProps) => {
  return (
    <>
      <BlogDetailPage id={params.id} />
    </>
  );
};

export default BlogDetailsPage;
