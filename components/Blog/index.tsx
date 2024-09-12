"use client";
import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/config/firebase";

const Blog = () => {
  const [blogData, setBlogData] = useState([])

  const fetchData = async (flag = "fetch") => {
    try {
      let q = query(
        collection(db, "posts"),
      );


      const querySnapshot = await getDocs(q);
      const newStore = querySnapshot.docs.map(doc => {
        const dt = doc.data();
        return {
          id: dt?.id,
          title: dt?.title,
          summary: dt?.summary,
          date: dt?.date,
          imageUrl: dt?.imageUrl,
        };
      });
      setBlogData(newStore);
    } catch (error) {
      console.error("Failed to fetch documents: ", error);

    };
  }

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Our Latest Blogs"
          paragraph="Get expert tips on search tech and digital marketing to boost your online presence."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogData.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlog blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
