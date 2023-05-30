import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Message {
  _id: string;
  text: string;
  isLoading: boolean;
  isAI: boolean;
  veid?: string;
  createdAt: string;
  bypass?: boolean;
  wavurl?: string;
  isSelected?: boolean;
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: state => {
      state.messages = [];
    },
    AppendMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        part?: string;
        final: boolean;
      }>,
    ) => {
      const {messageId, part, final} = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === messageId);
      if (messageIndex !== -1) {
        if (part !== undefined) {
          state.messages[messageIndex].text += part;
        }
        state.messages[messageIndex].isLoading = !final;
      }
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        newText?: string;
        isLoading?: boolean;
      }>,
    ) => {
      const {messageId, newText, isLoading} = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === messageId);
      if (messageIndex !== -1) {
        if (newText !== undefined) {
          state.messages[messageIndex].text = newText;
        }
        if (isLoading !== undefined) {
          state.messages[messageIndex].isLoading = isLoading;
        }
      }
    },
    updateMessageWavUrl: (
      state,
      action: PayloadAction<{messageId: string; wavUrl: string}>,
    ) => {
      const {messageId, wavUrl} = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === messageId);

      if (messageIndex !== -1) {
        state.messages[messageIndex].wavurl = wavUrl;
      }
    },
    updateSelectedMessages: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.messages.forEach((message, i) => {
        if (i === index || i === index - 1) {
          message.isSelected = true;
        }
      });
    },
    deselectAllMessages: state => {
      state.messages.forEach(message => {
        message.isSelected = false;
      });
    },
    removeSelectedMessages: state => {
      state.messages = state.messages.filter(message => !message.isSelected);
    },
    toggleMessageSelected: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === messageId);

      if (messageIndex !== -1) {
        state.messages[messageIndex].isSelected =
          !state.messages[messageIndex].isSelected;
      }
    },
  },
});

export const {
  setMessages,
  addMessage,
  clearMessages,
  AppendMessage,
  updateMessage,
  updateMessageWavUrl,
  updateSelectedMessages,
  deselectAllMessages,
  removeSelectedMessages,
  toggleMessageSelected,
} = messageSlice.actions;

export default messageSlice.reducer;
