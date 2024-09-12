import {
    IconArrowDown,
    IconPlayerStop,
    IconSend,
} from '@tabler/icons-react';
import {
    KeyboardEvent,
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Input } from '../google-search/ui/input';
import { Button } from '../google-search/ui/button';
import HomeContext from '@/contexts/homeContext';
import { ArrowRight } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { useTheme } from 'next-themes';

interface Props {
    input: string;
    handleInputChange: any;
    handleSubmit: any;
    onScrollDownClick: () => void;
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
    showScrollDownButton: boolean;
    length: number;
    isLoading: boolean;
    messages: any
}

export const ChatInput = ({
    input,
    handleInputChange,
    handleSubmit,
    onScrollDownClick,
    textareaRef,
    showScrollDownButton,
    length,
    isLoading,
    messages
}: Props) => {
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('GPT-3.5');
    const dropdownRef = useRef(null);
    const { theme } = useTheme();
    const {
        state: {
            isFullScreen,
            prompt
        }
    } = useContext(HomeContext);

    const toggleModelDropdown = () => {
        setIsModelSelectOpen(!isModelSelectOpen);
    };

    const handleItemClick = (item) => {
        setSelectedModel(item);
        setIsModelSelectOpen(false);
    };

    const isMobile = () => {
        const userAgent =
            typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
        const mobileRegex =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        return mobileRegex.test(userAgent);
    };

    const handleKeyDown = (e: KeyboardEvent<any>) => {
        if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
            console.log(selectedModel)
            handleSubmit(e, {
                data: {
                    model: selectedModel,
                    messages
                }
            });
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsModelSelectOpen(false);
        }
    };

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
            textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
                }`;
        }
    }, [input]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (prompt) {
            const fakeEvent = { target: { value: prompt } };
            handleInputChange(fakeEvent);
        }
    }, [prompt])

    return (
        !length ? (
            <div className="custom-scrollbar absolute bottom-[50px] left-0 w-full border-transparent md:pt-2">
                <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
                    {isLoading &&
                        <button
                            className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white md:mb-0 md:mt-2"
                            onClick={e => stop()}
                        >
                            <IconPlayerStop size={16} />Stop Generating
                        </button>}
                    <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#282c32] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">
                        <div className="absolute left-0 top-[-50px] rounded" ref={dropdownRef} >
                            <div>
                                <button
                                    id="dropdownHoverButton"
                                    onClick={toggleModelDropdown}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-[#4a6cf7] dark:focus:ring-blue-800"
                                    type="button"
                                >
                                    {selectedModel}
                                    <svg
                                        className="w-2.5 h-2.5 ms-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>

                                {isModelSelectOpen && (
                                    <div
                                        id="dropdownHover"
                                        className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700 mt-[5px]"
                                    >
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                                            <li>
                                                <div
                                                    onClick={() => handleItemClick('GPT-3.5')}
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                >
                                                    GPT-3.5
                                                </div>
                                            </li>
                                            <li>
                                                <div
                                                    onClick={() => handleItemClick('GPT-4')}
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                >
                                                    GPT-4
                                                </div>
                                            </li>
                                            <li>
                                                <div
                                                    onClick={() => handleItemClick('GPT-4o')}
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                                                >
                                                    GPT-4o
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {
                                isLoading && (
                                    <BeatLoader
                                        color={theme === "dark" ? "#ffffff" : "#000000"}
                                        className='mt-[12px] ml-[20px]'
                                        size={10}
                                    />
                                )
                            }
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="custom-scrollbar m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-4 text-black dark:bg-transparent dark:text-white md:py-3 focus:outline-none"
                            style={{
                                resize: 'none',
                                bottom: `${textareaRef?.current?.scrollHeight}px`,
                                maxHeight: '400px',
                                overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? 'auto' : 'hidden'}`,
                            }}
                            placeholder="Ask me anything."
                            value={input}
                            rows={1}
                            onCompositionStart={() => setIsTyping(true)}
                            onCompositionEnd={() => setIsTyping(false)}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            className="absolute right-2 top-3 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
                            onClick={handleSubmit}
                        >
                            <IconSend size={20} />
                        </button>

                        {showScrollDownButton && (
                            <div className="absolute bottom-12 right-0 lg:bottom-0 lg:-right-10">
                                <button
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
                                    onClick={onScrollDownClick}
                                >
                                    <IconArrowDown size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div
                className={`fixed bottom-8 left-0 right-0 mx-auto h-screen flex flex-col items-center justify-center ${isFullScreen ? "left-0" : "sm:left-64 top-[-10]"}`}
            >
                <div className='mb-[30px]'>
                    <svg className='dark:hidden w-16 h-16' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                        <path d="M 22.390625 3.0078125 C 17.654395 2.8436595 13.569833 5.8435619 11.859375 10.025391 C 9.0176557 10.679494 6.5710372 12.403786 5.0136719 14.898438 C 2.5039309 18.9172 3.0618709 23.952784 5.828125 27.525391 C 4.9739102 30.313925 5.2421456 33.294602 6.6230469 35.890625 C 8.849447 40.074109 13.491637 42.111879 17.96875 41.501953 C 19.956295 43.635551 22.671724 44.892008 25.609375 44.994141 C 30.344873 45.157538 34.429949 42.156517 36.140625 37.974609 C 38.982335 37.320506 41.427906 35.596214 42.984375 33.101562 C 45.494116 29.082044 44.937696 24.046828 42.171875 20.474609 C 43.02609 17.686075 42.757854 14.705398 41.376953 12.109375 C 39.150553 7.9258913 34.508363 5.8881211 30.03125 6.4980469 C 28.043705 4.3644591 25.328276 3.109049 22.390625 3.0078125 z M 21.632812 6.0078125 C 23.471341 5.9259913 25.222619 6.4704661 26.662109 7.5058594 C 26.386892 7.6365081 26.113184 7.7694041 25.845703 7.9238281 L 18.322266 12.267578 C 17.829266 12.552578 17.523484 13.077484 17.521484 13.646484 L 17.470703 25.443359 L 14 23.419922 L 14 14.277344 C 14 9.9533438 17.312812 6.1998125 21.632812 6.0078125 z M 31.925781 9.3496094 C 34.481875 9.4330566 36.944688 10.675 38.398438 12.953125 C 39.388773 14.504371 39.790276 16.293997 39.613281 18.058594 C 39.362598 17.885643 39.111144 17.712968 38.84375 17.558594 L 31.320312 13.216797 C 30.827312 12.932797 30.220562 12.930891 29.726562 13.212891 L 19.486328 19.066406 L 19.503906 15.050781 L 27.421875 10.478516 C 28.825875 9.6677656 30.392125 9.299541 31.925781 9.3496094 z M 11.046875 13.449219 C 11.022558 13.752013 11 14.055332 11 14.363281 L 11 23.050781 C 11 23.619781 11.302922 24.146594 11.794922 24.433594 L 21.984375 30.376953 L 18.498047 32.369141 L 10.580078 27.798828 C 6.8350781 25.635828 5.240375 20.891687 7.234375 17.054688 C 8.0826085 15.421856 9.4306395 14.178333 11.046875 13.449219 z M 29.501953 15.630859 L 37.419922 20.201172 C 41.164922 22.364172 42.759625 27.108313 40.765625 30.945312 C 39.917392 32.578144 38.569361 33.821667 36.953125 34.550781 C 36.977447 34.247986 37 33.944668 37 33.636719 L 37 24.949219 C 37 24.380219 36.697078 23.853406 36.205078 23.566406 L 26.015625 17.623047 L 29.501953 15.630859 z M 24.019531 18.763672 L 28.544922 21.400391 L 28.523438 26.638672 L 23.980469 29.236328 L 19.455078 26.599609 L 19.476562 21.361328 L 24.019531 18.763672 z M 30.529297 22.556641 L 34 24.580078 L 34 33.722656 C 34 38.046656 30.687188 41.800187 26.367188 41.992188 C 24.528659 42.074009 22.777381 41.529534 21.337891 40.494141 C 21.613108 40.363492 21.886816 40.230596 22.154297 40.076172 L 29.677734 35.732422 C 30.170734 35.447422 30.476516 34.922516 30.478516 34.353516 L 30.529297 22.556641 z M 28.513672 28.933594 L 28.496094 32.949219 L 20.578125 37.521484 C 16.834125 39.683484 11.927563 38.691875 9.6015625 35.046875 C 8.6112269 33.495629 8.2097244 31.706003 8.3867188 29.941406 C 8.6374463 30.114402 8.8888065 30.286983 9.15625 30.441406 L 16.679688 34.783203 C 17.172688 35.067203 17.779438 35.069109 18.273438 34.787109 L 28.513672 28.933594 z"></path>
                    </svg>
                    <svg className='hidden dark:block w-16 h-16' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                        <path fill='#ffffff' d="M 22.390625 3.0078125 C 17.654395 2.8436595 13.569833 5.8435619 11.859375 10.025391 C 9.0176557 10.679494 6.5710372 12.403786 5.0136719 14.898438 C 2.5039309 18.9172 3.0618709 23.952784 5.828125 27.525391 C 4.9739102 30.313925 5.2421456 33.294602 6.6230469 35.890625 C 8.849447 40.074109 13.491637 42.111879 17.96875 41.501953 C 19.956295 43.635551 22.671724 44.892008 25.609375 44.994141 C 30.344873 45.157538 34.429949 42.156517 36.140625 37.974609 C 38.982335 37.320506 41.427906 35.596214 42.984375 33.101562 C 45.494116 29.082044 44.937696 24.046828 42.171875 20.474609 C 43.02609 17.686075 42.757854 14.705398 41.376953 12.109375 C 39.150553 7.9258913 34.508363 5.8881211 30.03125 6.4980469 C 28.043705 4.3644591 25.328276 3.109049 22.390625 3.0078125 z M 21.632812 6.0078125 C 23.471341 5.9259913 25.222619 6.4704661 26.662109 7.5058594 C 26.386892 7.6365081 26.113184 7.7694041 25.845703 7.9238281 L 18.322266 12.267578 C 17.829266 12.552578 17.523484 13.077484 17.521484 13.646484 L 17.470703 25.443359 L 14 23.419922 L 14 14.277344 C 14 9.9533438 17.312812 6.1998125 21.632812 6.0078125 z M 31.925781 9.3496094 C 34.481875 9.4330566 36.944688 10.675 38.398438 12.953125 C 39.388773 14.504371 39.790276 16.293997 39.613281 18.058594 C 39.362598 17.885643 39.111144 17.712968 38.84375 17.558594 L 31.320312 13.216797 C 30.827312 12.932797 30.220562 12.930891 29.726562 13.212891 L 19.486328 19.066406 L 19.503906 15.050781 L 27.421875 10.478516 C 28.825875 9.6677656 30.392125 9.299541 31.925781 9.3496094 z M 11.046875 13.449219 C 11.022558 13.752013 11 14.055332 11 14.363281 L 11 23.050781 C 11 23.619781 11.302922 24.146594 11.794922 24.433594 L 21.984375 30.376953 L 18.498047 32.369141 L 10.580078 27.798828 C 6.8350781 25.635828 5.240375 20.891687 7.234375 17.054688 C 8.0826085 15.421856 9.4306395 14.178333 11.046875 13.449219 z M 29.501953 15.630859 L 37.419922 20.201172 C 41.164922 22.364172 42.759625 27.108313 40.765625 30.945312 C 39.917392 32.578144 38.569361 33.821667 36.953125 34.550781 C 36.977447 34.247986 37 33.944668 37 33.636719 L 37 24.949219 C 37 24.380219 36.697078 23.853406 36.205078 23.566406 L 26.015625 17.623047 L 29.501953 15.630859 z M 24.019531 18.763672 L 28.544922 21.400391 L 28.523438 26.638672 L 23.980469 29.236328 L 19.455078 26.599609 L 19.476562 21.361328 L 24.019531 18.763672 z M 30.529297 22.556641 L 34 24.580078 L 34 33.722656 C 34 38.046656 30.687188 41.800187 26.367188 41.992188 C 24.528659 42.074009 22.777381 41.529534 21.337891 40.494141 C 21.613108 40.363492 21.886816 40.230596 22.154297 40.076172 L 29.677734 35.732422 C 30.170734 35.447422 30.476516 34.922516 30.478516 34.353516 L 30.529297 22.556641 z M 28.513672 28.933594 L 28.496094 32.949219 L 20.578125 37.521484 C 16.834125 39.683484 11.927563 38.691875 9.6015625 35.046875 C 8.6112269 33.495629 8.2097244 31.706003 8.3867188 29.941406 C 8.6374463 30.114402 8.8888065 30.286983 9.15625 30.441406 L 16.679688 34.783203 C 17.172688 35.067203 17.779438 35.069109 18.273438 34.787109 L 28.513672 28.933594 z"></path>
                    </svg>
                </div>
                <div className="max-w-2xl w-full px-6">
                    <div className="relative flex items-center w-full">
                        <Input
                            type="text"
                            name="input"
                            placeholder="Ask me anything."
                            value={input}
                            onChange={handleInputChange}
                            className="pl-4 pr-10 h-12 rounded-[10px] bg-muted dark:bg-[#282c32] focus:outline-non rounded-full text-[18px]"
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            type="submit"
                            size={'icon'}
                            variant={'ghost'}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            disabled={input.length === 0}
                            onClick={e => handleSubmit(e, {
                                data: {
                                    model: selectedModel
                                }
                            })}
                        >
                            <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>
            </div >
        )
    );
};

