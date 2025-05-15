import React from 'react';
import { cn } from '@/lib/utils';
import { Icon as IconType } from '@phosphor-icons/react';

interface NavButtonProps {
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

export function NavButton({ icon: Icon, active = false, onClick }: NavButtonProps) {
  return (
    <button
      className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center transition-all text-white cursor-pointer",
        active 
          ? "bg-zinc-600/70"
          : "hover:bg-zinc-600/40"
      )}
      onClick={onClick}
    >
      <span className="text-xl"><Icon size={26} /></span>
    </button>
  );
}
