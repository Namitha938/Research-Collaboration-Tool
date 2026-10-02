import React from "react";
import { Hammer } from "lucide-react";

export default function ComingSoon({ title }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600"><Hammer size={26} /></div>
      <h1 className="mt-5 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This page is not built yet. Its backend routes in <code>server/</code> are still TODO.</p>
    </div>
  );
}
