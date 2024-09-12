
"use client";

import HomeContext from '@/contexts/homeContext';
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import { useContext } from 'react';

interface Props {
  onClick: any;
  side: 'left' | 'right';
}

export const CloseSidebarButton = ({ onClick, side }: Props) => {
  const {
    state: {
      isFullScreen
    },
  } = useContext(HomeContext);

  return (
    <>
      <button
        className={`fixed top-12.5 ${side === 'right' ? 'right-[270px]' : 'left-[270px]'
          } z-50 h-7 w-7 hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:${isFullScreen === true ? "top-[10px]" : "top-[100px]"} sm:${side === 'right' ? 'right-[270px]' : 'left-[270px]'
          } sm:h-8 sm:w-8 sm:text-neutral-700`}
        onClick={onClick}
      >
        {side === 'right' ? <IconArrowBarRight /> : <IconArrowBarLeft />}
      </button>
      <div
        onClick={onClick}
        className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
      ></div>
    </>
  );
};

export const OpenSidebarButton = ({ onClick, side }: Props) => {
  const {
    state: {
      isFullScreen
    },
  } = useContext(HomeContext);

  return (
    <button
      className={`fixed top-12.5 ${side === 'right' ? 'right-2' : 'left-2'
        } z-50 h-7 w-7 text-white hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:${isFullScreen === true ? "top-[10px]" : "top-[100px]"}  sm:${side === 'right' ? 'right-2' : 'left-2'
        } sm:h-8 sm:w-8 sm:text-neutral-700`}
      onClick={onClick}
    >
      {side === 'right' ? <IconArrowBarLeft /> : <IconArrowBarRight />}
    </button>
  );
};
