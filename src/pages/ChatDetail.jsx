import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { addMessage } from "../store/chatSlice";
import DOMPurify from "dompurify";
import { marked } from "marked";
import UserAvatar from "../assets/chat.png";
import BotAvatar from "../assets/chat.png";
import '../index.css';

const ChatDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Get the current chat from the Redux store
  const { data: chats, loading } = useSelector((state) => state.chat);
  const currentChat = chats.find(chat => chat.id === id);

  useEffect(() => {
    if (id && !currentChat) {
      // Redirect to home if chat doesn't exist
      navigate("/");
    }
  }, [id, currentChat, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    dispatch(addMessage({ 
      idChat: id, 
      userMess: message, 
      botMess: "Processing your request..." 
    }));
    
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Show welcome screen if no chat is selected
  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <img src={BotAvatar} alt="Bot" className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Welcome to My ChatGPT
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start a new conversation or select an existing chat to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
        <h1 className="text-lg font-medium text-gray-800 dark:text-white truncate">
          {currentChat.title || "New Chat"}
        </h1>
        {loading && (
          <span className="ml-2 inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {currentChat.messages && currentChat.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} message-animation`}>
            <div className={`flex max-w-[80%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'} items-end`}>
              <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mb-1 mx-2">
                <img 
                  src={msg.isBot ? BotAvatar : UserAvatar} 
                  alt={msg.isBot ? "Bot" : "User"} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div 
                className={`rounded-2xl px-4 py-3 ${
                  msg.isBot 
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm' 
                    : 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                }`}
              >
                {msg.isBot ? (
                  <div 
                    className="prose dark:prose-invert prose-sm prose-p:my-1 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:p-2 prose-pre:rounded prose-code:text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(marked(msg.text)) 
                    }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white py-3 px-4 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[48px] max-h-[200px]"
              rows="1"
              disabled={loading}
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={!message.trim() || loading} 
            className={`p-3 rounded-full transition-colors duration-200 ${
              message.trim() && !loading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDetail;