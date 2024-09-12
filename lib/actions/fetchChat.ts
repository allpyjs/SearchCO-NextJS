import { getChat as fetchChat } from '@/lib/actions/chat';

export const getChat = async (id: string, userId: string) => {
    'use server';
    const chat = await fetchChat(id, userId);
    return chat;
};