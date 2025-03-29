import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  data: [],
  loading: false,
  error: null
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Add a new chat
    addChat: (state) => {
      const newChat = {
        id: uuidv4(),
        title: 'New Chat',
        messages: []
      };
      state.data.push(newChat);
    },
    
    // Remove a chat
    removeChat: (state, action) => {
      state.data = state.data.filter(chat => chat.id !== action.payload);
    },
    
    // Update chat title
    updateChatTitle: (state, action) => {
      const { id, title } = action.payload;
      const chat = state.data.find(chat => chat.id === id);
      if (chat) {
        chat.title = title;
      }
    },
    
    // Add messages (both user and bot)
    addMessage: (state, action) => {
      const { idChat, userMess, botMess } = action.payload;
      const chat = state.data.find(chat => chat.id === idChat);
      
      if (chat) {
        // Add user message
        chat.messages.push({
          id: uuidv4(),
          isBot: false,
          text: userMess,
          timestamp: new Date().toISOString()
        });
        
        // Add bot message
        chat.messages.push({
          id: uuidv4(),
          isBot: true,
          text: botMess,
          timestamp: new Date().toISOString()
        });
        
        // If this is the first message, set the chat title based on the user's message
        if (chat.messages.length === 2 && chat.title === 'New Chat') {
          // Limit title length for display purposes
          chat.title = userMess.length > 30
            ? `${userMess.substring(0, 30)}...`
            : userMess;
        }
      }
      
      // Set loading to true to simulate API request
      state.loading = true;
      
      // In a real app, you'd dispatch an async thunk action here
      // For now, simulate a response with setTimeout
      setTimeout(() => {
        state.loading = false;
      }, 1000);
    },
    
    // Update a bot message (e.g. with streaming response)
    updateBotMessage: (state, action) => {
      const { chatId, messageId, text } = action.payload;
      const chat = state.data.find(chat => chat.id === chatId);
      if (chat) {
        const message = chat.messages.find(msg => msg.id === messageId && msg.isBot);
        if (message) {
          message.text = text;
        }
      }
    }
  }
});

// Export actions
export const { 
  setLoading, 
  setError, 
  addChat, 
  removeChat, 
  updateChatTitle, 
  addMessage,
  updateBotMessage
} = chatSlice.actions;

export default chatSlice.reducer;

