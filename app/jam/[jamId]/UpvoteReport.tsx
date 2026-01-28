import { useState } from 'react';
import { ThumbsUp, Flag } from 'lucide-react';

export default function UpvoteReport() {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const upvoteCount = 235;

  return (
    <div className="flex flex-col items-end justify-end gap-2 lg:ml-auto pt-12 lg:pt-0">
      {/* Upvote Button */}
      <button
        onClick={() => setIsUpvoted(!isUpvoted)}
        className={`flex items-center gap-1.5 group transition-all px-3
          ${isUpvoted ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'}`}
      >
        <div
          className={`p-1.5 rounded-lg transition-colors 
          ${isUpvoted ? 'bg-emerald-500/20' : 'group-hover:bg-emerald-500/10'}`}
        >
          <ThumbsUp
            size={18}
            className={`transition-transform group-active:scale-90 
              ${isUpvoted ? 'fill-emerald-400' : 'group-hover:fill-emerald-400/20'}`}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums tracking-tight">
          {isUpvoted ? upvoteCount + 1 : upvoteCount}
        </span>
      </button>

      {/* Report Button */}
      <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 text-slate-400 rounded-md text-xs font-medium transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 active:scale-95">
        <span>Report Jam</span>
        <Flag size={14} />
      </button>
    </div>
  );
}
