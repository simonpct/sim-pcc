"use client";

import { useEffect, useState } from "react";

export  default function Header() {
  
  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <header className="flex items-center justify-between border-b bg-zinc-800 text-white px-4 py-2 rounded-xl">
    <div className="flex flex-col">
      <span className="font-bold" >{date?.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).replace(/^(\w)(\w*)/, (_, firstLetter, rest) => firstLetter.toUpperCase() + rest)}</span>
      <span>{date ? new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date) : ''}</span>
    </div>
    <label htmlFor="search" className="sr-only">Rechercher un arr t</label>
    <input
      type="search"
      id="search"
      placeholder="Rechercher un arr t"
      className="text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-zinc-200"
    />
  </header>;
}