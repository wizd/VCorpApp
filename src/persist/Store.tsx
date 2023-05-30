import {combineReducers, configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {logger} from 'redux-logger';
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
  createTransform,
} from 'redux-persist';

const ignoreNestedNonPersisted = nonPersisted =>
  createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => {
      if (nonPersisted.hasOwnProperty(key)) {
        const state = {...inboundState};
        nonPersisted[key].forEach(nestedKey => {
          if (state.hasOwnProperty(nestedKey)) {
            state[nestedKey] = undefined;
          }
        });
        return state;
      }
      return inboundState;
    },
    // transform state being rehydrated
    outboundState => outboundState,
  );

const rootReducer = combineReducers({
  audio: audioReducer,
  company: companyReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [
    ignoreNestedNonPersisted({
      company: ['isAILoading'],
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    let middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    // Add `thunk` middleware
    middleware = middleware.concat(thunk);

    // Add `logger` middleware only in development
    if (process.env.NODE_ENV === 'development') {
      //middleware = middleware.concat(logger);
    }

    return middleware;
  },
});

export const persistor = persistStore(store);
