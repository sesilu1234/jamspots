'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThumbsUp, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useSession } from 'next-auth/react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UpvoteReport({ jamId }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const upvoteCount = 235;

  const ensureAuth = (actionName) => {
    if (!session) {
      toast("Login required", {
        description: `You need to be logged in to ${actionName}.`,
        descriptionStyle: { color: 'white', opacity: '1' }, // High visibility fix
        action: {
          label: "Login",
          onClick: () => router.push(`/signIn?callbackUrl=${encodeURIComponent(pathname)}`),
        },
      });
      return false;
    }
    return true;
  };

  const handleReportSubmit = async () => {
    if (!reason) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/private/jam-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jam_id: jamId,
          reason,
          description,
        }),
      });

      if (!response.ok) throw new Error('Failed to send');

      toast.success("Report sent", {
        description: "Thank you for helping the community stay updated.",
      });
      
      setReportOpen(false);
      setReason("");
      setDescription("");
    } catch (error) {
      toast.error("Error", { description: "Could not submit report. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-end justify-end gap-2 lg:ml-auto pt-12 lg:pt-0">
      {/* Upvote Button */}
      <button
        onClick={() => {
          if (ensureAuth("upvote")) {
            setIsUpvoted(!isUpvoted);
          }
        }}
        className={`flex items-center gap-1.5 group transition-all px-3
          ${isUpvoted ? 'text-emerald-400' : 'text-tone-1 hover:text-emerald-400'}`}
      >
        <div
          className={`p-1.5 rounded-lg transition-colors 
          ${isUpvoted ? 'bg-emerald-500/20' : 'group-hover:bg-emerald-500/10'}`}
        >
          <ThumbsUp
            size={18}
            className={`transition-transform group-active:scale-90 
              ${isUpvoted ? ' fill-emerald-400/30' : 'group-hover:fill-emerald-400/20'}`}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums tracking-tight ">
          {isUpvoted ? upvoteCount + 1 : upvoteCount}
        </span>
      </button>

      {/* Report Button */}
      <button 
        onClick={() => {
            if (ensureAuth("report a jam")) {
                setReportOpen(true);
            }
        }}
        className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 text-tone-0 rounded-md text-xs font-medium transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 active:scale-95"
      >
        <span>Report Jam</span>
        <Flag size={14} />
      </button>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-[425px] bg-neutral-100 border-1 border-stone-800 text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Report Jam Session</DialogTitle>
            <DialogDescription className="text-black/60">
              Help us maintain the map. What is wrong with this jam?
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black/70 pl-1">Reason</label>
              <Select onValueChange={setReason} value={reason}>
                <SelectTrigger className="bg-neutral-100 border-slate-700 text-black/70">
                  <SelectValue placeholder="Why are you reporting?" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-100 border-slate-700 text-black/70">
                  <SelectItem value="closed">Jam is closed / doesn't exist</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                  <SelectItem value="wrong_info">Wrong location or time</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black/70 pl-1">Extra Details</label>
              <Textarea 
                placeholder="Optional description..." 
                className="bg-neutral-100/40 border-1 border-slate-700/40 text-black/70 resize-none h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button 
               variant={null}
                onClick={() => setReportOpen(false)}
                className="bg-black/20 text-black text-black/60 hover:text-black/90 "
            >
                Cancel
            </Button>
            <Button 
                onClick={handleReportSubmit}
                disabled={isSubmitting || !reason}
                className="bg-red-600 hover:bg-red-700 text-white  px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Sending..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster/>
    </div>
  );
}