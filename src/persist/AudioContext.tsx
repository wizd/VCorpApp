import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {Platform} from 'react-native';
import Sound from 'react-native-sound';
import {useToast} from '../utils/useToast';
import {isValidUrl} from '../utils/util';

export class Playing {
  url: string | undefined;
  sound: Sound | null;

  constructor(url: string | undefined, sound: Sound | null) {
    this.url = url;
    this.sound = sound;
  }

  release() {
    if (this.sound) {
      this.sound.release();
    }
  }
}

enum PlayingStatus {
  InPlaying,
  Paused,
  Stopped,
}

interface AudioContextType {
  addToPlayList: (url: string) => void;
  playOrPause: () => void;
  playNext: () => void;
  stop: () => void;
  playList: string[];
  currentUrl?: string;
  canPlay: boolean;
  isPaused: boolean;
  playingStatus: PlayingStatus;
}

const AudioContext = createContext<AudioContextType>({
  addToPlayList: () => {},
  playOrPause: () => {},
  playNext: () => {},
  stop: () => {},
  playList: [],
  currentUrl: undefined,
  canPlay: false,
  isPaused: false,
  playingStatus: PlayingStatus.Stopped,
});

interface AudioProviderProps {
  children: React.ReactNode;
}

interface AudioState {
  playList: string[];
  currentUrl: string | undefined;
  isPaused: boolean;
  canPlay: boolean;
  playingStatus: PlayingStatus;
  error: string | null;
}

type AudioAction =
  | {type: 'addToPlayList'; url: string}
  | {type: 'playOrPause'}
  | {type: 'playNext'}
  | {type: 'PLAY_START'}
  | {type: 'PLAY_SUCCESS'; payload: Playing}
  | {type: 'PLAY_FAILURE'; error: string};

const initialState: AudioState = {
  playList: [],
  currentUrl: undefined,
  isPaused: false,
  canPlay: false,
  playingStatus: PlayingStatus.Stopped,
  error: null,
};

const audioReducer = (
  state: AudioState = initialState,
  action: AudioAction,
): AudioState => {
  console.log('audioReducer action: ', action);
  switch (action.type) {
    case 'addToPlayList': {
      if (!isValidUrl(action.url)) {
        return state;
      }
      if (state.playList.includes(action.url)) {
        return state;
      }
      return {...state, playList: [...state.playList, action.url]};
    }
    // case 'playOrPause': {
    //   if (state.currentPlaying) {
    //     if (state.currentPlaying.sound?.isPlaying()) {
    //       state.currentPlaying.sound.pause();
    //       return {...state, isPaused: true};
    //     } else {
    //       state.currentPlaying.sound?.play();
    //       return {...state, isPaused: false};
    //     }
    //   }
    //   return state;
    // }
    case 'playNext': {
      // if (state.currentPlaying) {
      //   state.currentPlaying.sound?.stop();
      //   state.currentPlaying.sound?.release();
      // }
      if (state.playList.length > 1) {
        const nextPlayList = state.playList.slice(1);
        return {...state, playList: nextPlayList, currentUrl: ''};
      }
      return state;
    }
    case 'PLAY_START': {
      return {
        ...state,
        playingStatus: PlayingStatus.InPlaying,
        currentUrl: state.playList[0],
      };
    }
    case 'PLAY_SUCCESS': {
      return {...state, error: null};
    }
    case 'PLAY_FAILURE': {
      return {
        ...state,
        playingStatus: PlayingStatus.Stopped,
        error: action.error,
      };
    }
    default: {
      return state;
    }
  }
};

// 使用 configureStore 创建 store
const store = configureStore({
  reducer: audioReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
});

//const store = createStore(audioReducer, applyMiddleware(thunk));

// Thunk action creator
const playSound = (url: string) => (dispatch, getState) => {
  dispatch({type: 'addToPlayList', url});
  dispatch({type: 'PLAY_START'});

  const sb = Platform.OS === 'ios' ? '' : Sound.MAIN_BUNDLE;
  const sound = new Sound(url, sb, error => {
    if (error) {
      console.log('failed to load the sound', error);
      dispatch({type: 'PLAY_FAILURE', error: error.message});
      return;
    }

    sound.play(success => {
      if (success) {
        console.log('Sound played successfully');
        dispatch({
          type: 'PLAY_SUCCESS',
          //payload: new Playing(url, sound),
        });
      } else {
        console.log('Sound play failed');
        dispatch({type: 'PLAY_FAILURE', error: 'Sound play failed'});
      }
    });
  });
};

export const AudioProvider: React.FC<AudioProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const showToast = useToast();

  useEffect(() => {
    console.log(
      'playList updated: ',
      state.playList,
      'currentUrl: ',
      state.currentUrl,
      'canPlay: ',
      state.canPlay,
    );
    if (state.error) {
      showToast(state.error);
    }
    if (state.playList.length > 0 && state.currentUrl === undefined) {
    }
  }, [showToast, state.canPlay, state.currentUrl, state.playList, state.error]);

  const addToPlayList = (url: string) => {
    store.dispatch(playSound(url));
  };

  const playOrPause = () => {
    dispatch({type: 'playOrPause'});
  };

  const playNext = () => {
    dispatch({type: 'playNext'});
  };

  const stop = () => {
    dispatch({type: 'stop'});
  };

  return (
    <AudioContext.Provider
      value={{
        addToPlayList,
        playOrPause,
        playNext,
        stop,
        playList: state.playList,
        currentUrl: state.currentUrl,
        canPlay: state.canPlay,
        isPaused: state.isPaused,
        playingStatus: state.playingStatus,
      }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
