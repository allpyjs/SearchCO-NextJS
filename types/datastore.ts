type DateStore = {
    id: string,
    name: string,
    docCnt: number,
    description: string,
    public: boolean
}

type Document = {
    id: string,
    name: string,
    type: string
}

type WebDateStore = {
    id: string,
    name: string,
    url: string,
    description: string,
    public: boolean
}

export type {
    WebDateStore,
    DateStore,
    Document
}