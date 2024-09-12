"use client";

import { useTheme } from "next-themes";
import { AuthContextProvider } from "@/contexts/authContext";
import { toast, ToastContainer } from "react-toastify";
import HomeContext from "@/contexts/homeContext";
import { HomeInitialState, initialState } from "@/contexts/homeContext/state";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import { FolderInterface, FolderType } from "@/types/folder";
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Prompt } from "@/types/prompt";
import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });
  const { user } = useAuth();
  const {
    state: {
      folders,
      prompts,
    },
    dispatch,
  } = contextValue;

  const handleCreateFolder = async (name: string, type: FolderType) => {
    if (user) {
      console.log("Hello")
      let docId = uuidv4();
      const newFolder: FolderInterface = {
        id: docId,
        name,
        type,
      };
      const updatedFolders = [...folders, newFolder];
      dispatch({ field: 'folders', value: updatedFolders });
      await addDoc(
        collection(db, 'history', user?.email, 'folders'), {
        id: docId,
        name,
        type
      }
      )
    }
    else {
      toast.warning("Please Signin to add prompt folder.");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (user) {
      const updatedFolders = folders.filter((f) => f.id !== folderId);
      dispatch({ field: 'folders', value: updatedFolders });
      const updatedPrompts: Prompt[] = prompts.map((p) => {
        if (p.folderId === folderId) {
          return {
            ...p,
            folderId: null,
          };
        }
        return p;
      });
      dispatch({ field: 'prompts', value: updatedPrompts });
      const q = query(collection(db, "history", user?.email!, "folders"), where("id", "==", folderId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc: any) => {
        await deleteDoc(doc.ref);
      });
    }
    else {
      toast.warning("Please Signin to delete prompt folder.");
    }
  };

  const handleUpdateFolder = async (folderId: string, name: string) => {
    if (user) {
      const updatedFolders = folders.map((f) => {
        if (f.id === folderId) {
          return {
            ...f,
            name,
          };
        }
        return f;
      });
      dispatch({ field: 'folders', value: updatedFolders });
      const q = query(collection(db, "history", user?.email!, "folders"), where("id", "==", folderId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc: any) => {
        await updateDoc(doc.ref, { name });
      });
    }
    else {
      toast.warning("Please Signin to update prompt folder.");
    }
  };

  return (
    <HomeContext.Provider value={{
      ...contextValue,
      handleCreateFolder,
      handleDeleteFolder,
      handleUpdateFolder,
    }}>
      <AuthContextProvider>
        {children}
        < ToastContainer
          position="top-center"
          autoClose={2000}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          hideProgressBar={true}
          draggable={true}
        />
      </AuthContextProvider >
    </HomeContext.Provider>
  );
}