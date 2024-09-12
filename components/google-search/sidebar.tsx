"use client";

import { useEffect, useState } from 'react';
import { History } from './history';
import { getChats } from '@/lib/actions/chat';
import { useAuth } from '@/contexts/authContext';

export default function Sidebar() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const loadedChats = await getChats(user.uid);
        setChats(loadedChats);
      }
    };
    fetchChats();
  }, [user]);

  return (
    <div className="h-screen p-2 fixed top-0 right-0 flex-col justify-center pb-24 flex">
      <History location="sidebar" chats={chats} />
    </div>
  );
}
