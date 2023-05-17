import {combineReducers, configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import audioReducer from './slices/playlistSlice';
import companyReducer from './slices/companySlice';
import chatReducer, {chatClientMiddleware} from './slices/chatSlice';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
  audio: audioReducer,
  company: companyReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk), //chatClientMiddleware
});

export const {dispatch} = store;
export const persistor = persistStore(store);
