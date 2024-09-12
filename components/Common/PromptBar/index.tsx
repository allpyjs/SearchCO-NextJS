import { useContext, useEffect, useState } from 'react';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { savePrompts } from '@/utils/app/prompts';
import { Prompt } from '@/types/prompt';

import HomeContext from '@/contexts/homeContext';
import PromptbarContext from './PromptBar.context';
import { useAuth } from '@/contexts/authContext';

import { PromptFolders } from '@/components/Common/PromptBar/components/PromptFolders';
import { PromptbarSettings } from '@/components/Common/PromptBar/components/PromptbarSettings';
import { Prompts } from '@/components/Common/PromptBar/components/Prompts';
import Sidebar from './Sidebar';

import { PromptbarInitialState, initialState } from './PromptBar.state';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, deleteDoc, DocumentData, DocumentReference, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

import { db } from '@/config/firebase';
import { toast } from 'react-toastify';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/google-search/ui/sheet'
import { Button } from '@/components/google-search/ui/button'
import { ChevronLeft, Menu } from 'lucide-react'

const Promptbar = () => {
    const { user } = useAuth();

    const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
        initialState,
    });

    const {
        state: { prompts, showPromptbar },
        dispatch: homeDispatch,
        handleCreateFolder,
    } = useContext(HomeContext);

    const {
        state: { searchTerm, filteredPrompts },
        dispatch: promptDispatch,
    } = promptBarContextValue;

    const handleTogglePromptbar = () => {
        homeDispatch({ field: 'showPromptbar', value: !showPromptbar });
    };

    const handleCreatePrompt = async () => {
        if (user) {
            let docId = uuidv4();
            const newPrompt: Prompt = {
                id: docId,
                name: `Prompt ${prompts.length + 1}`,
                description: '',
                content: '',
                folderId: null,
            };
            const updatedPrompts = [...prompts, newPrompt];
            homeDispatch({ field: 'prompts', value: updatedPrompts });

            await addDoc(
                collection(db, 'history', user?.email, 'prompts'), {
                id: docId,
                name: `Prompt ${prompts.length + 1}`,
                description: '',
                content: '',
                folderId: null,
                createdAt: serverTimestamp()
            }
            )
        }
        else {
            toast.warning("Please sign in to create prompt.");
        }
    };

    const handleDeletePrompt = async (prompt: Prompt) => {
        if (user) {
            const updatedPrompts = prompts.filter((p) => p.id !== prompt.id);

            homeDispatch({ field: 'prompts', value: updatedPrompts });

            const chatsRef = collection(db, 'history', user?.email, 'prompts');
            const q = query(chatsRef, where("id", "==", prompt.id));
            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    return;
                }
                querySnapshot.forEach(async (doc: { ref: DocumentReference<unknown, DocumentData>; }) => {
                    await deleteDoc(doc.ref);
                });
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
        else {
            toast.warning("Please sign in to delete prompt.");
        }
    };

    const handleUpdatePrompt = (prompt: Prompt) => {
        if (user) {
            const updatedPrompts = prompts.map((p) => {
                if (p.id === prompt.id) {
                    return prompt;
                }
                return p;
            });
            homeDispatch({ field: 'prompts', value: updatedPrompts });
        }
        else {
            toast.warning("Please sign in to update prompt.");
        }
    };

    const handleDrop = (e: any) => {
        if (e.dataTransfer) {
            const prompt = JSON.parse(e.dataTransfer.getData('prompt'));
            const updatedPrompt = {
                ...prompt,
                folderId: e.target.dataset.folderId,
            };
            handleUpdatePrompt(updatedPrompt);
            e.target.style.background = 'none';
        }
    };

    useEffect(() => {
        if (searchTerm) {
            promptDispatch({
                field: 'filteredPrompts',
                value: prompts.filter((prompt) => {
                    const searchable =
                        prompt.name.toLowerCase() +
                        ' ' +
                        prompt.description.toLowerCase() +
                        ' ' +
                        prompt.content.toLowerCase();
                    return searchable.includes(searchTerm.toLowerCase());
                }),
            });
        } else {
            promptDispatch({ field: 'filteredPrompts', value: prompts });
        }
    }, [searchTerm, prompts]);

    return (
        <PromptbarContext.Provider
            value={{
                ...promptBarContextValue,
                handleCreatePrompt,
                handleDeletePrompt,
                handleUpdatePrompt,
            }}
        >
            <div className="h-screen p-2 fixed top-0 right-0 flex-col justify-center pb-24 flex">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className='rounded-full text-foreground/30 dark:bg-[#2b3444] hover:dark:bg-[#282c32]'
                        >
                            <ChevronLeft size={26} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[290px] dark:bg-[#2b3444] border-none">

                        <Sidebar<Prompt>
                            side={'right'}
                            isOpen={showPromptbar}
                            addItemButtonTitle='New prompt'
                            itemComponent={
                                <Prompts
                                    prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
                                />
                            }
                            folderComponent={<PromptFolders />}
                            items={filteredPrompts}
                            searchTerm={searchTerm}
                            handleSearchTerm={(searchTerm: string) =>
                                promptDispatch({ field: 'searchTerm', value: searchTerm })
                            }
                            toggleOpen={handleTogglePromptbar}
                            handleCreateItem={handleCreatePrompt}
                            handleCreateFolder={() => handleCreateFolder('New folder', 'prompt')}
                            handleDrop={handleDrop}
                            footerComponent={<PromptbarSettings />}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </PromptbarContext.Provider>
    );
};

export default Promptbar;
