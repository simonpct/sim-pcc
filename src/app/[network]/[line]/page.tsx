"use client";

import { useParams } from "next/navigation";

export default function Page() {

  const {network, line} = useParams();

  return <div>Page {network} {line}</div>;
}