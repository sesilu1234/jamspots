import { useState } from 'react';

export default function CommentSection() {
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedThreads, setExpandedThreads] = useState([1]); // Defaulting ID 1 to open for example

  const mockComments = [
    { 
      id: 1, 
      user: "Alex_Dev", 
      text: "What's the theme for this year's jam?", 
      time: "2h ago",
      replies: [
        { id: 101, user: "Host_Admin", text: "We reveal it right when the timer starts! 😉", time: "1h ago" },
        { id: 102, user: "PixelArtPanda", text: "I hope it's 'Space' again.", time: "30m ago" }
      ]
    },
    { 
      id: 2, 
      user: "Sarah_Design", 
      text: "Can we use external assets or does everything need to be custom?", 
      time: "45m ago",
      replies: [
        { id: 201, user: "Host_Admin", text: "Everything is allowed as long as you credit the source! 🚀", time: "10m ago" }
      ]
    },
    { 
      id: 3, 
      user: "Solo_Coder", 
      text: "Looking for a teammate! I handle C# and Unity.", 
      time: "5m ago",
      replies: []
    }
  ];

  const toggleThread = (id) => {
    setExpandedThreads(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[1300px] max-w-[90%] lg:max-w-[75%] mx-auto pb-24 flex flex-col gap-6">
      <div className="flex flex-col gap-4 bg-tone-0/0 p-6 rounded-lg border-0 border-tone-0/10 text-white">
        <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-tone-0">Questions & Discussion</h3>
        
        <div className="flex flex-col gap-6">
          {mockComments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-3">
              {/* Parent Comment */}
              <div className="p-4 bg-white/5 rounded-md border-l-4 border-tone-0/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-tone-0">{comment.user}</span>
                  <span className="text-[10px] opacity-50">{comment.time}</span>
                </div>
                <p className="text-sm lg:text-md opacity-80 mb-3">{comment.text}</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-[11px] uppercase tracking-wider font-bold opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {replyingTo === comment.id ? "Cancel" : "Reply"}
                  </button>
                  
                  {comment.replies.length > 0 && (
                    <button 
                      onClick={() => toggleThread(comment.id)}
                      className="text-[11px] uppercase tracking-wider font-bold text-tone-0/70 hover:text-tone-0 transition-colors"
                    >
                      {expandedThreads.includes(comment.id) ? "Hide Replies" : `View ${comment.replies.length} Replies`}
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Input Dropdown */}
              {replyingTo === comment.id && (
                <div className="ml-8 flex gap-2 animate-in slide-in-from-top-1 duration-200">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder={`Reply to ${comment.user}...`} 
                    className="flex-1 bg-white/10 p-2 rounded-md text-xs outline-none border border-white/10 focus:border-tone-0/50"
                  />
                  <button className="bg-tone-0/40 px-4 py-1 rounded-md hover:bg-tone-0/60 text-xs font-medium transition-all">
                    Send
                  </button>
                </div>
              )}

              {/* Nested Replies Rendering */}
              {expandedThreads.includes(comment.id) && comment.replies.length > 0 && (
                <div className="ml-8 flex flex-col gap-3 border-l border-white/10 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-3 bg-white/5 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-tone-0/80">{reply.user}</span>
                        <span className="text-[9px] opacity-40">{reply.time}</span>
                      </div>
                      <p className="text-xs lg:text-sm opacity-70">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global Post Input */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
          <span className="text-xs font-semibold opacity-40 uppercase tracking-widest">Post a new comment</span>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask the host a question..." 
              className="flex-1 bg-white/5 p-3 rounded-md text-sm outline-none border border-white/5 focus:border-tone-0/30"
            />
            <button className="bg-white/10 px-6 py-2 rounded-md hover:bg-white/20 transition-all text-sm font-medium">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}