import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-yellow-500/90 backdrop-blur-sm text-black px-4 py-1.5 text-center font-semibold text-[10px] md:text-xs flex items-center justify-center gap-2 fixed bottom-0 left-0 right-0 z-50 shadow-lg border-t border-yellow-400">
      <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
      <span>
        DISCLAIMER: This tool highlights potential risk areas but does not replace laboratory testing.
      </span>
    </div>
  );
}
