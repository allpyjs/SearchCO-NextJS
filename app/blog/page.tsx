import Breadcrumb from "@/components/Common/Breadcrumb";
import BlogPage from "@/components/Blog";

import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Blog Page | Search.co",
    description: "This is Blog Page for Startup Nextjs Template",
    // other metadata
};

const Blog = () => {

    return (
        <>
            <Breadcrumb
                pageName="Blog"
                description=""
            />

            <BlogPage />
        </>
    );
};

export default Blog;
