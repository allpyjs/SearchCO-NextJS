import { useContext } from 'react';

import { FolderInterface } from '@/types/folder';

import HomeContext from '@/contexts/homeContext';

import Folder from '@/components/Common/Folder';
import { PromptComponent } from './Prompt';

import PromptbarContext from '../PromptBar.context';

import { useAuth } from '@/contexts/authContext';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const PromptFolders = () => {
  const {
    state: { folders },
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredPrompts },
    handleUpdatePrompt,
  } = useContext(PromptbarContext);
  const { user } = useAuth();

  const handleDrop = async (e: any, folder: FolderInterface) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      if (folder.id === "default-prompts-folder") {
        return;
      }

      const updatedPrompt = {
        ...prompt,
        folderId: folder.id,
      };

      handleUpdatePrompt(updatedPrompt);

      if (user) {
        const q = query(collection(db, "history", user?.email!, "prompts"), where("id", "==", prompt.id));
        try {
          const querySnapshot = await getDocs(q);
          for (const doc of querySnapshot.docs) {
            await updateDoc(doc.ref, { folderId: folder.id });
          }
        } catch (error) {
          console.error("Failed to update documents:", error);
        }
      }
    }
  };

  const PromptFolders = (currentFolder: FolderInterface) =>
    filteredPrompts
      .filter((p) => p.folderId)
      .map((prompt, index) => {
        if (prompt.folderId === currentFolder.id) {
          return (
            <div key={index} className="ml-5 gap-2 border-l pl-2">
              <PromptComponent prompt={prompt} />
            </div>
          );
        }
      });

  return (
    <div className="flex w-full flex-col pt-2">
      {folders
        .filter((folder) => folder.type === 'prompt')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((folder, index) => (
          <Folder
            key={index}
            searchTerm={searchTerm}
            currentFolder={folder}
            handleDrop={handleDrop}
            folderComponent={PromptFolders(folder)}
          />
        ))}
    </div>
  );
};
