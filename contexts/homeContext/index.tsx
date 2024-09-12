import { Dispatch, createContext } from 'react';
import { ActionType } from '@/hooks/useCreateReducer';
import { HomeInitialState } from './state';
import { FolderType } from '@/types/folder';

export interface HomeContextProps {
    state: HomeInitialState;
    dispatch: Dispatch<ActionType<HomeInitialState>>;
    handleCreateFolder: (name: string, type: FolderType) => void;
    handleDeleteFolder: (folderId: string) => void;
    handleUpdateFolder: (folderId: string, name: string) => void;
}

const HomeContext = createContext<HomeContextProps>(undefined!);

export default HomeContext;