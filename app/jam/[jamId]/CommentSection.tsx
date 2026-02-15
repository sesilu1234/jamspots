import { useState } from 'react';

export default function CommentSection() {
  const [replyingTo, setReplyingTo] = useState<null | number>(null);
  const [expandedThreads, setExpandedThreads] = useState([1]); // ID 1 open by default

  interface Reply {
  id: number;
  user: string;
  time: string;
  text: string;
  avatar: string;
  deleted_at: boolean | string | null;
}

interface Comment extends Reply {
  replies: Reply[]; // Only top-level comments have this
}

  const initialComments: Comment[] = [
    {
      id: 1,
      user: 'Alex_Synth',
      time: '2m ago',
      text: 'What delay pedal are you using for that lead tone? It sounds incredible! 🎸 sda sad sa dsa dsa dsa dsa dsa dsa dsa sad dsa dsa dsadsa  a dsa dsa dsa asd sa dsad sa dsdsa  dsa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      deleted_at : null,
      replies: [
        {
          id: 101,
          user: 'Host_Admin',
          time: '1m ago',
          text: "That's actually the Strymon Timeline! Running it into a slightly overdriven tube amsssssssssssssssssssssssssssssp sd s dasd a dsa dsa dssa dsa  dsa dsa dsaads  dsa.",
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          deleted_at : null
        },
        {
          id: 102,
          user: 'Host_Admin',
          time: '1m ago',
          text: "That's actually the Strymon Timeline! Running it into a slightly overdriven tube amp.",
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          deleted_at : null
        },
      ],
    },
    {
      id: 102,
      user: 'Host_Admin',
      time: '1m ago',
      text: "That's actually the Strymon Timeline! Running it into a slightly overdriven tube amp.",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      deleted_at : null,
      replies: [],
    },
    {
      id: 2,
      user: 'JordanMix',
      time: '10m ago',
      text: 'Can you show the MIDI routing for the drum rack again? I missed that part.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      deleted_at : null,
      replies: [],
    },
  ];

  const [commentsState, setCommentsState] = useState<Comment[]>(initialComments);

  const toggleThread = (id: number) => {
    setExpandedThreads((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id],
    );
  };

  const postMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(), // simple unique id
      user: 'JordanMix',
      time: 'now',
      text: message,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      deleted_at : null,
      replies: [],
    };

    setCommentsState((prev) => [newMessage, ...prev]);
    setMessage('');
  };

  const postReply = (id: number) => {
    if (!messageReply.trim()) return;

    const newReply = {
      id: Date.now(),
      user: 'JordanMix',
      time: 'now',
      text: messageReply,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      deleted_at : null
    };

    setCommentsState((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment,
      ),
    );

    setMessageReply('');
  };

  const deleteCommentOrReply = (parentId: number, replyId: number | null = null) => {
  const now = new Date().toISOString();

  setCommentsState((prev) =>
    prev.map((comment) => {
      // 1. Handle top-level comment deletion
      if (replyId === null) {
        if (comment.id === parentId) {
          return { ...comment, deleted_at: now };
        }
        return comment;
      }

      // 2. Handle reply deletion inside a specific parent
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === replyId ? { ...reply, deleted_at: now } : reply
          ),
        };
      }

      return comment;
    })
  );
};

  const [message, setMessage] = useState('');
  const [messageReply, setMessageReply] = useState('');

  return (
    <div className="w-[1300px] max-w-[95%] mx-auto py-12 px-6   border-t border-white/5 text-tone-0">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Comments & Questions</h3>
        <p className="text-sm opacity-60">
          Ask about the jam, the setup, or coordinate with other musicians.
        </p>
      </div>

      {/* Main Input Area */}
      <div className="mb-12">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shrink-0 shadow-lg shadow-purple-500/20" />
          <div className="flex-1">
            <textarea
              placeholder="Ask a question or leave a comment..."
              className="w-full bg-tone-0/5 border border-tone-0/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none placeholder:opacity-50"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                onClick={() => postMessage()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentsState.map((comment) => (
          <div key={comment.id} className="group/comment ">
            {/* Parent Comment */}
            <div className="relative flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group/commentbox border border-transparent hover:border-white/5">

            {comment.deleted_at ? (
  <div className="w-10 h-10 rounded-full border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent shrink-0" />
) : (
  <img src={comment.avatar} className="w-10 h-10 rounded-full bg-white/10" alt="avatar" />
)}
             
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <span className="font-bold text-sm text-purple-400">
                    {comment.deleted_at ? "[deleted]" : comment.user}
                  </span>
                  {comment.user === 'Host_Admin' && (
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 font-bold uppercase tracking-wider">
                      Host
                    </span>
                  )}
                  <span className="text-[10px] opacity-40 uppercase tracking-widest">
                    {comment.time}
                  </span>
                </div>
                <div className="text-sm leading-relaxed opacity-90 mb-3 max-w-[80%]">
                  {comment.deleted_at ? (
                    <em className="text-gray-500 italic">[This message was deleted]</em>
                  ) : comment.text}
                </div>
                
 <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/commentbox:opacity-100 transition-opacity">
                    <CommentOptions onDelete={() =>{deleteCommentOrReply(comment.id)}}  isDeleted={comment.deleted_at} />
                      </div>



                <div className="flex gap-4 items-center">
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id,
                      )
                    }
                    className="text-[11px] font-bold opacity-40 hover:opacity-100 hover:text-purple-400 transition-all uppercase tracking-tighter"
                  >
                    {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                  </button>

                  {comment.replies.length > 0 && (
                    <button
                      onClick={() => toggleThread(comment.id)}
                      className="text-[11px] font-bold opacity-40 hover:opacity-100 transition-all uppercase tracking-tighter"
                    >
                      {expandedThreads.includes(comment.id)
                        ? 'Hide Thread'
                        : `View ${comment.replies.length} Replies`}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply Input (The "Dropdown") */}
            {replyingTo === comment.id && (
              <div className="ml-14 mt-2 mb-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    autoFocus
                    placeholder={`Reply to ${comment.user}...`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-purple-500/50 transition-all"
                    value={messageReply}
                    onChange={(e) => setMessageReply(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      className="bg-purple-600/80 hover:bg-purple-600 px-4 py-1.5 rounded-md text-[11px] font-bold transition-all"
                      onClick={() => postReply(comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Threaded Replies */}
            {expandedThreads.includes(comment.id) &&
              comment.replies.length > 0 && (
                /* Reduced margin-left and padding to save horizontal space */
                <div className="ml-16 mt-3 mb-8 space-y-3 border-l border-white/10 pl-4">
                  {comment.replies.map((reply) => (
                    // ADDED: "group/reply" to the className below
                    <div
                      key={reply.id}
                      className="group/reply relative flex gap-2 p-1.5 rounded-lg hover:bg-white/[0.02] transition-colors max-w-[70%]"
                    >

                       {reply.deleted_at ? (
  <div className="w-6 h-6  rounded-full border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent shrink-0" />
) : (
  <img src={reply.avatar} className="w-6 h-6 rounded-full bg-white/10 shrink-0" alt="avatar" />
)}
                     
                      <div className="min-w-0 ">
                        <div className="flex items-center gap-2 mb-0.5">
                          
                          <span className="font-bold text-[10px] text-purple-300/80 truncate">
                           {reply.deleted_at ? "[deleted]" : reply.user}
                          </span>
                          <span className="text-[8px] opacity-30 uppercase whitespace-nowrap">
                            {reply.time}
                          </span>
                        </div>

                         <div className="text-[12px] leading-snug opacity-70  break-words pr-8">
                  {reply.deleted_at ? (
                    <em className="text-gray-500 italic">[This message was deleted]</em>
                  ) : reply.text}
                </div>

                      
                      </div>

                      {/* This will now trigger because the parent has group/reply */}
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                        <CommentOptions onDelete={() =>{deleteCommentOrReply(comment.id, reply.id)}} isDeleted={reply.deleted_at}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}


interface CommentOptionsProps {
  onDelete: () => void;
  // onRestore: () => void; // New prop for reviving
  // onEdit: () => void;
  isDeleted: boolean;    // Pass (deleted_at !== null) here
}

export function CommentOptions({ onDelete, isDeleted }: CommentOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-md transition-colors ${
          isOpen ? 'bg-white/20' : 'hover:bg-white/10'
        } text-white/60 hover:text-white`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl py-1 px-1 overflow-hidden z-50">
            
            {/* Only show Edit if NOT deleted */}
            {!isDeleted && (
              <button
                onClick={() => { setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-white/10 rounded-sm transition-colors flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit
              </button>
            )}

            {/* TOGGLE: Delete vs Restore */}
            {isDeleted ? (
              <button
                onClick={() => { setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs text-green-400 hover:bg-green-500/10 rounded-sm transition-colors flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Restore
              </button>
            ) : (
              <button
                onClick={() => { setIsOpen(false); onDelete(); }}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-sm transition-colors flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Delete
              </button>
            )}
            
            <div className="h-[1px] w-[90%] mx-auto bg-white/5 my-1" />
            
            <button className="w-full text-left px-4 py-2 text-xs text-white/40 hover:bg-white/5 rounded-sm transition-colors">
              Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}