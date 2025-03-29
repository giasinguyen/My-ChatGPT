import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PlusIcon, ArrowLeftIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { addChat, removeChat } from "../store/chatSlice";
import Logo from "../assets/chat.png";

const SideBar = ({ isOpen, setIsOpen }) => {
  const { data: chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [hoveredChatId, setHoveredChatId] = useState(null);

  const handleCreateChat = () => {
    dispatch(addChat());
    const newChat = chats[chats.length - 1];
    if (newChat) {
      navigate(`/c/${newChat.id}`);
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeChat(chatId));
    if (id === chatId) navigate("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-20 top-4 ${isOpen ? 'left-[260px]' : 'left-4'} md:hidden bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg transition-all duration-300`}
      >
        <ArrowLeftIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Sidebar */}
      <aside 
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed md:sticky top-0 left-0 z-10 h-full w-64 
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          flex flex-col`}
      >
        {/* Sidebar header with logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-lg dark:text-white">My ChatGPT</span>
          </Link>
        </div>

        {/* New chat button */}
        <div className="p-4">
          <button
            onClick={handleCreateChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Cuộc trò chuyện mới</span>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
          <div className="py-2 space-y-1">
            {chats && chats.map((chat) => (
              <Link
                key={chat.id}
                to={`/c/${chat.id}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  id === chat.id 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                } transition-colors duration-200`}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="truncate">
                    {chat.title || "New Chat"}
                  </div>
                </div>
                {hoveredChatId === chat.id && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            My ChatGPT v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;