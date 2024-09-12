import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { Prompt } from '@/types/prompt';
import { Oval } from 'react-loader-spinner';
import { useAuth } from '@/contexts/authContext';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { IconShare } from '@tabler/icons-react';
import { db } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { savePrompts } from '@/utils/app/prompts';
import HomeContext from '@/contexts/homeContext';

interface Props {
  prompt: Prompt;
  onClose: () => void;
  onUpdatePrompt: (prompt: Prompt) => void;
}

export const PromptModal: FC<Props> = ({ prompt, onClose, onUpdatePrompt }) => {
  const [name, setName] = useState(prompt.name);
  const [description, setDescription] = useState(prompt.description);
  const [content, setContent] = useState(prompt.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUser, setShareUser] = useState("");

  const {
    state: { prompts },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onUpdatePrompt({ ...prompt, name, description, content: content.trim() });
      onClose();
    }
  };

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

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    if (prompt.folderId === "default-prompts-folder") {
      const newPrompt = {
        ...prompt,
        name,
        description,
        content: content.trim(),
        folderId: null,
        createdAt: serverTimestamp()
      };
      const updatedPrompts = [...prompts, newPrompt];
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      savePrompts([...prompts, newPrompt]);

      if (user?.email) {
        try {
          await addDoc(collection(db, "history", user?.email!, "prompts"), { ...newPrompt });
        } catch (error) {
          let message = (error as Error).message;
          console.log(message);
        }
      }

      toast.success("The prompt was successfully updated.")
      setIsSaving(false);

      return;
    }

    const updatedPrompt = {
      ...prompt,
      name,
      description,
      content: content.trim(),
    };
    onUpdatePrompt(updatedPrompt);

    if (user?.email) {
      const q = query(collection(db, "history", user?.email!, "prompts"), where("id", "==", updatedPrompt?.id));
      try {
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
          await updateDoc(doc.ref, { ...updatedPrompt });
        }
      } catch (error) {
        let message = (error as Error).message;
        console.log(message);
      }
    }

    toast.success("The prompt was successfully updated.")
    setIsSaving(false);
  }

  const handleShare = async () => {
    if (user) {
      if (shareUser === "") {
        toast.warn("Please input user's name to share.");
        return;
      }
      // if (shareUser === user.userid) {
      //   toast.warn("Please the other user's name to share.");
      //   return;
      // }
      setIsSharing(true);
      const q = query(collection(db, "users"), where("userid", "==", shareUser));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Please input user id correctly. The user id doesn't exits.")
      }
      else {
        for (const dc of querySnapshot.docs) {
          let dt = dc.data();
          let docId = uuidv4();

          const q1 = query(collection(db, "users"), where("email", "==", user?.email));
          const querySnapshot1 = await getDocs(q1);
          for (const doc1 of querySnapshot1.docs) {
            const userRef = doc(db, "users", doc1.id);

            await addDoc(
              collection(db, 'history', dt.email, 'sharedprompts'), {
              ...prompt,
              sourceRef: userRef,
              id: docId
            }
            )
            toast.success("The prompt was shared for the user successfully.")
          }
        }
      }

      setIsSharing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50"
      onKeyDown={handleEnter}
    >
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[800px] transform overflow-y-auto rounded-lg border border-gray-700 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#1d2430] sm:my-8 sm:max-h-[700px] w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-sm font-bold text-black dark:text-neutral-200">
              Name
            </div>
            <input
              ref={nameInputRef}
              className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              placeholder='A name for your prompt.'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
              Description
            </div>
            <textarea
              className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              style={{ resize: 'none' }}
              placeholder='A description for your prompt.'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
              Prompt
            </div>
            <textarea
              className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
              style={{ resize: 'none' }}
              placeholder='Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />

            {user && <div className='flex gap-2 items-center justify-between w-full'>
              <input
                className="mt-[5px] border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-4 py-1 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                placeholder="Please input user id to share."
                value={shareUser}
                onChange={(e) => setShareUser(e.target.value)}
              />
              <button
                type="button"
                className="mt-3 rounded-full flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none border-gray-500 dark:border-gray-600 dark:border-opacity-50 dark:text-white hover:dark:bg-gray-700"
                onClick={handleShare}
              >
                {isSharing ? <Oval
                  visible={true}
                  height="20"
                  width="30"
                  color="#4A6CF7"
                  secondaryColor='#3C56C0'
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                /> : <IconShare size={18} />}
              </button>
            </div>}

            <button
              type="button"
              className="mt-[20px] w-full px-[20px] rounded-md border-[1px] py-[5px] flex justify-center items-center gap-2 border-gray-500 dark:border-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-700"
              onClick={handleSave}
            >
              {isSaving && <Oval
                visible={true}
                height="20"
                width="30"
                color="#4fa94d"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />}
              <span className='font-bold text-[20px]'> {isSaving ? "Saving" : "Save"} </span>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

