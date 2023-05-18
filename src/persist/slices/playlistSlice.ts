import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Sound from 'react-native-sound';
import {Platform} from 'react-native';
import {isValidUrl} from '../../utils/util';

enum PlayingStatus {
  InPlaying,
  Paused,
  Stopped,
}

export interface AudioState {
  playList: string[];
  currentUrl: string | undefined;
  isPaused: boolean;
  canPlay: boolean;
  playingStatus: PlayingStatus;
  error: string | undefined;
}

const initialState: AudioState = {
  playList: [],
  currentUrl: undefined,
  isPaused: false,
  canPlay: false,
  playingStatus: PlayingStatus.Stopped,
  error: undefined,
};

let currentSound: Sound | undefined;

export const playStop = createAsyncThunk(
  'playlist/playStop',
  async (_, {dispatch, getState}) => {
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      currentSound = undefined;
    }
    dispatch(stopAction());
    dispatch(playSuccess());
  },
);

export const playPause = createAsyncThunk(
  'playlist/playPause',
  async (_, {dispatch, getState}) => {
    if (currentSound) {
      const state = getState() as {audio: AudioState};
      if (state.audio.isPaused) {
        currentSound.play();
        dispatch(resumeAction());
      } else {
        currentSound.pause();
        dispatch(pauseAction());
      }
    }
  },
);

export const playNext = createAsyncThunk(
  'playlist/playNext',
  async (_, {dispatch, getState}) => {
    dispatch(playStop());

    setTimeout(() => {
      const state2 = getState() as {audio: AudioState};
      if (state2.audio.playList.length > 0) {
        dispatch(playSound(state2.audio.playList[0]));
      }
    }, 10);
  },
);

async function playAudioSound(url: string, dispatch: any, getState: any) {
  const sb = Platform.OS === 'ios' ? '' : Sound.MAIN_BUNDLE;
  currentSound = new Sound(url, sb, error => {
    console.log('playAudioSound is now playing', url);
    if (error) {
      console.log('failed to load the sound', error);
      return Promise.reject({error: error.message});
    }
    if (!currentSound) {
      console.log('currentSound is null');
      return;
    }
    dispatch(playStart());
    currentSound.play(success => {
      if (success) {
        console.log('Sound played successfully');
        dispatch(playSuccess());

        // Add setTimeout here
        setTimeout(() => {
          const state2 = getState() as {audio: AudioState};
          if (state2.audio.playList.length > 0) {
            playAudioSound(state2.audio.playList[0], dispatch, getState);
          }
        }, 1000);
      } else {
        console.log('Sound play failed');
        return Promise.reject({error: 'Sound play failed'});
      }
    });
  });
}

export const playSound = createAsyncThunk(
  'playlist/playSound',
  async (url: string, {dispatch, getState}) => {
    dispatch(addToPlayList(url));

    const state = getState() as {audio: AudioState};
    console.log('playSound -> getstate() is:', state);

    if (state.audio.playingStatus === PlayingStatus.InPlaying) {
      return Promise.resolve();
    }
    if (state.audio.playList[0] !== url) {
      return Promise.resolve();
    }

    await playAudioSound(url, dispatch, getState);
  },
);

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    addToPlayList(state, action) {
      console.log('addToPlayList was called:', action.payload);
      if (!isValidUrl(action.payload)) {
        return;
      }
      if (state.playList.includes(action.payload)) {
        return;
      }
      state.playList.push(action.payload);
      if (state.playList.length === 1) {
        state.currentUrl = action.payload;
      }
    },
    nextAction(state) {
      if (state.playList.length > 1) {
        const nextPlayList = state.playList.slice(1);
        state.playList = nextPlayList;
        state.currentUrl = '';
      }
    },
    playStart(state) {
      console.log('playStart was called');
      state.playingStatus = PlayingStatus.InPlaying;
      state.currentUrl = state.playList[0];
      state.canPlay = true;
      state.isPaused = false;
    },
    playSuccess(state) {
      console.log('playSuccess was called');
      state.error = undefined;
      state.playingStatus = PlayingStatus.Stopped;
      state.currentUrl = undefined;
      state.canPlay = state.playList.length > 1;
      state.playList = state.playList.slice(1);
    },
    playFailure(state, action) {
      state.playingStatus = PlayingStatus.Stopped;
      state.error = action.payload;
    },
    pauseAction(state) {
      state.isPaused = true;
    },
    resumeAction(state) {
      state.isPaused = false;
    },
    stopAction(state) {
      state.isPaused = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(playSound.pending, state => {
        // handle the state when pending
      })
      .addCase(playSound.fulfilled, state => {
        // handle the state when fulfilled
      })
      .addCase(playSound.rejected, (state, action) => {
        // handle the state when rejected
        state.playingStatus = PlayingStatus.Stopped;
        state.error = action.error.message;
      });
  },
});

export const {
  addToPlayList,
  playStart,
  playSuccess,
  playFailure,
  pauseAction,
  resumeAction,
  stopAction,
  nextAction,
} = playlistSlice.actions;

export default playlistSlice.reducer;
