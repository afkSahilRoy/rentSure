import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <Loader2 className="animate-spin text-[#865D36]" size={36} strokeWidth={1.75} />
    </div>
  );
}