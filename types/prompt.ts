export interface Prompt {
    id: string;
    name: string;
    description: string;
    content: string;
    folderId: string | null;
}

export interface SharedPrompt {
    id: string;
    name: string;
    description: string;
    content: string;
    folderId: string | null;
    source: string | null;
}

export interface LibraryPrompt {
    id: number;
    label: string;
    value: string;
}

export interface SharedModalPrompt {
    name: string;
    description: string;
    content: string;
}