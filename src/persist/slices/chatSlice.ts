// chatSlice.js
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import ChatClient from '../../comm/chatClient';
import {AppState} from 'react-native';
import {VwsMessage} from '../../comm/wsproto';
import {dispatch} from '../Store';

let chatClient: ChatClient | null = null;

export type ChatServerState = {
  isOnline: boolean;
  newMessages: [];
};

export const initialChatServerState: ChatServerState = {
  isOnline: false,
  newMessages: [],
};

// This is a custom middleware
// export const chatClientMiddleware = storeAPI => next => action => {
//   if (action.type === 'chat/handleConnection/fulfilled') {
//     chatClient?.onNewMessage(message => {
//       storeAPI.dispatch({type: 'chat/newMessage', payload: message});
//     });
//   }

//   // This will run the action through the rest of the middleware chain and then finally to the reducers
//   return next(action);
// };

// dispatch(handleChatClientConnection({apiUrl: 'your-api-url', jwt: 'your-jwt', appState: 'active'}));

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (msg: VwsMessage, {dispatch, getState}) => {
    // Your existing registerUser logic...
    //const state = getState() as {chatState: ChatServerState};
    chatClient?.sendChatMessage(msg);
    return Promise.resolve();
  },
);

// Thunk for handling chat client connection
export const handleChatClientConnection = createAsyncThunk(
  'chat/handleConnection',
  async ({
    apiUrl,
    jwt,
    appState,
  }: {
    apiUrl: string;
    jwt: string;
    appState: string;
  }) => {
    chatClient = new ChatClient(apiUrl, jwt, dispatch);
    if (appState === 'active') {
      chatClient.reconnect();
      return true;
    } else {
      chatClient.disconnect();
      return false;
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialChatServerState,
  reducers: {
    newMessage: (state, action) => {
      // handle the new message here
      state.newMessages.push(action.payload);
    },
    clearMessage: (state, action: PayloadAction<string>) => {
      state.newMessages = state.newMessages.filter(
        message => message.id !== action.payload,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(handleChatClientConnection.fulfilled, (state, action) => {
      state.isOnline = action.payload;
    });
  },
});

export default chatSlice.reducer;
