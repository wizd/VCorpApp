// chatSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ChatClient from '../../comm/chatClient';
import { AppState, AppStateStatus } from 'react-native';
import { VwsMessage, VwsSystemMessage } from '../../comm/wsproto';

export let chatClient: ChatClient | null = null;

export type ChatServerState = {
  isOnline: boolean;
  newMessages: VwsMessage[];
};

export const initialChatServerState: ChatServerState = {
  isOnline: false,
  newMessages: [],
};

export const createShareOnServer = createAsyncThunk(
  'chat/createShare',
  async (msgpack: string, { dispatch, getState }) => {
    const reqmsg: VwsSystemMessage = {
      id: new Date().getTime().toString(),
      src: 'client',
      dst: 'server',
      type: 'system',
      time: new Date().getTime(),
      cmd: 'share',
      note: msgpack,
    };

    console.log('createShareOnServer', reqmsg);
    chatClient?.sendChatMessage(reqmsg);
    return Promise.resolve();
  },
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (msg: VwsMessage, { dispatch, getState }) => {
    // Your existing registerUser logic...
    //const state = getState() as {chatState: ChatServerState};
    chatClient?.sendChatMessage(msg);
    return Promise.resolve();
  },
);

// Thunk for starting chat client connection
export const connect = createAsyncThunk(
  'chat/connect',
  async (
    { apiUrl, jwt }: { apiUrl: string; jwt: string },
    { dispatch, getState },
  ) => {
    chatClient = new ChatClient(apiUrl, jwt, dispatch);
    return true; // indicate that the connection has been created successfully
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialChatServerState,
  reducers: {
    connected: (state, action) => {
      // handle the new message here
      console.log("oh yeah, we're connected");
      state.isOnline = true;
    },
    disconnected: (state, action) => {
      // handle the new message here
      state.isOnline = false;
    },
    newMessage: (state, action) => {
      // handle the new message here
      state.newMessages.push(action.payload);
    },
    clearMessage: (state, action: PayloadAction<VwsMessage>) => {
      state.newMessages = state.newMessages.filter(
        message =>
          message.id !== action.payload.id &&
          message.time !== action.payload.time,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(connect.fulfilled, (state, action) => {
      state.isOnline = action.payload;
      state.newMessages = [];
    });
  },
});

export const { clearMessage } = chatSlice.actions;

export default chatSlice.reducer;
