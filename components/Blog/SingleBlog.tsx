import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { format } from 'date-fns';

function truncateString(str, num) {
  if (str && str.length > num) {
    return str.slice(0, num) + "...";
  }
  return str;
}


const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { id, title, summary, imageUrl, date } = blog;
  return (
    <>
      <div className="group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
        <Link
          href={`/blog/blog-details/${id}`}
          className="relative block aspect-[37/22] w-full"
        >
          <img src={imageUrl} alt="Image Preview" />
        </Link>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3>
            <Link
              href={`/blog/blog-details/${id}`}
              className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
            {truncateString(summary, 250)}
          </p>
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-medium text-dark dark:text-white">
                {format(new Date(date), "dd MMM yyyy")}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
