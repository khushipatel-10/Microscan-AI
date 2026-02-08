import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-yellow-500 text-black px-4 py-2 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2 fixed bottom-0 left-0 right-0 z-50">
      <AlertTriangle className="h-5 w-5" />
      <span>
        DISCLAIMER: This tool does not replace laboratory testing. It highlights potential microplastic risk areas that may require further investigation.
      </span>
    </div>
  );
}
