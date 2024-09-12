import { MouseEventHandler, ReactNode } from 'react';

interface Props {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const SidebarButton = ({ handleClick, children }: Props) => (
  <button
    className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
    onClick={handleClick}
  >
    {children}
  </button>
);

export default SidebarButton;
