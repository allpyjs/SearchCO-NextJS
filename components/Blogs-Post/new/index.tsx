"use client";
import React, { useState } from 'react';
import MarkdownEditorComponent from '../MarkdownEditor';
import { db, storage } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import PreviewDialog from '../PreviewDialog';

type BlogError = {
    title?: string,
    summary?: string,
    content?: string,
    image?: string
}

const NewPost = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [isBlogSaving, setIsBlogSaving] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState<BlogError>();
    const [isVisiblePreviewDialog, setIsVisiblePreviewDialog] = useState(false);

    const handleImageChange = (file) => {
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors: BlogError = {};

        if (!title) newErrors.title = "Title is required.";
        if (!summary) newErrors.summary = "Summary is required.";
        if (!content) newErrors.content = "Content is required.";
        if (!image) newErrors.image = "Image is required.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview('');
        setImageUrl('');
    };

    const handleImageUpload = async (name) => {

        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUrl(downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsBlogSaving(true);

        try {
            if (!image) return;
            const id = uuidv4();
            const uniqueFileName = `${id}-${image.name}`;
            const imgUrl = await handleImageUpload(uniqueFileName);
            console.log(imgUrl)
            await addDoc(collection(db, 'posts'), {
                id,
                title,
                summary,
                content,
                imageUrl: imgUrl,
                date: new Date().toISOString(),
            });
            setIsBlogSaving(false);
            toast.success("Your Blog was published successfully.")
            router.push("/blogs-post")
        } catch (e) {
            console.error("Error adding document: ", e);
            setIsBlogSaving(false);
        }
    };

    return (
        <div className="w-full p-4 flex flex-col items-center pb-[100px]">
            <div className="w-full flex justify-center text-[30px] font-bold">Create New Blog Post</div>
            <div className="w-[90%] h-full overflow-auto mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="w-full mt-[10px]">
                        <label className="text-left text-neutral-700 dark:text-neutral-400 w-[20%]">
                            Title :
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter title here."
                            className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, title: null }));
                            }}
                        />
                        {errors?.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div className="w-full mt-[10px]">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="w-[250px] px-[20px] mt-[10px] rounded-md items-center border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700 cursor-pointer">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd" />
                            </svg>
                            <span>Upload Image</span>
                        </label>
                        {errors?.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                        {imagePreview && (
                            <div className="relative mt-2">
                                <img src={imagePreview} alt="Image Preview" className="max-h-40 object-cover rounded" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 left-2 p-1 bg-red-500 rounded-full text-white"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="w-full mt-[10px]">
                        <label className="text-left text-neutral-700 dark:text-neutral-400">
                            Summary :
                        </label>
                        <textarea
                            rows={4}
                            name="summary"
                            placeholder="Enter description here."
                            className="mt-[5px] border-stroke dark:text-[#eeeeee] dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                            value={summary}
                            onChange={(e) => {
                                setSummary(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, summary: null }));
                            }}
                        />
                        {errors?.summary && <p className="text-red-500 text-sm">{errors.summary}</p>}
                    </div>

                    <div className="w-full mt-[10px]">
                        <label className="text-left text-neutral-700 dark:text-neutral-400">
                            Content :
                        </label>
                        <MarkdownEditorComponent
                            initialValue=""
                            onChange={(text) => {
                                setContent(text);
                                setErrors((prevErrors) => ({ ...prevErrors, content: null }));
                            }}
                            theme="dark"
                        />
                        {errors?.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                    </div>

                    <div className='flex gap-3'>
                        <button
                            onClick={e => {
                                e.preventDefault();

                                setIsVisiblePreviewDialog(true);
                            }}
                            className="px-[20px] mt-[10px] rounded-md items-center border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                        >
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            Preview
                        </button>
                        <button
                            type="submit"
                            className="px-[20px] mt-[10px] rounded-md items-center border-[1px] py-[5px] flex justify-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
                        >
                            {isBlogSaving && (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                                    ></path>
                                </svg>
                            )}
                            <span>{!isBlogSaving ? "Publish" : "Publishing"}</span>
                        </button>
                    </div>
                </form>
            </div>
            <PreviewDialog
                open={isVisiblePreviewDialog}
                onClose={() => {
                    setIsVisiblePreviewDialog(false);
                }}
                content={content}
            />
        </div>
    );
};

export default NewPost;
