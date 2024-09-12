import { FC, useContext, useEffect, useRef, useState } from 'react';
import HomeContext from '@/contexts/homeContext';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const PromptLibraryDialog: FC<Props> = ({ open, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        state: {
            libraryPrompts
        },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener('mouseup', handleMouseUp);
            onClose();
        };

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [onClose]);

    const selectPrompt = (item: any) => {
        homeDispatch({
            field: 'prompt',
            value: item.value,
        });
    }

    if (!open) {
        return <></>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50">
            <div className="fixed inset-0 z-10 overflow-hidden">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                    />

                    <div
                        ref={modalRef}
                        className="custom-scrollbar dark:border-netural-400 inline-block max-h-[700px] transform overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[500px] w-full sm:max-w-[500px] sm:p-6 sm:align-middle"
                        role="dialog"
                    >
                        <div className="text-3xl font-bold text-black dark:text-white"  >
                            Prompts Library
                        </div>

                        <div className='mt-[20px]'>
                            <table className='bg-gray-100 text-black border-[#000000] dark:text-white dark:border-[#FFFFFF] dark:bg-gray-700 rounded-[8px] w-full'>
                                <thead>
                                    <tr>
                                        <th className='text-left py-2 px-4'>ID</th>
                                        <th className='text-left py-2 px-4'>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {libraryPrompts?.map(item => (
                                        <tr key={item.id} className="cursor-pointer dark:border-[#FFFFFF] hover:bg-gray-200 dark:hover:bg-gray-600" onClick={e => selectPrompt(item)} >
                                            <td className="py-2 px-4">{item.id + 1}</td>
                                            <td className="py-2 px-4">{item.label}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
