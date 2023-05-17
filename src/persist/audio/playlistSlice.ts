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

export const playSound = createAsyncThunk(
  'playlist/playSound',
  async (url: string, {dispatch, getState}) => {
    dispatch(addToPlayList(url));

    const state = getState() as {audio: AudioState};
    console.log('playSound -> getstate() is:', state);

    if (state.audio.playingStatus === PlayingStatus.InPlaying) {
      return Promise.resolve();
    }

    const sb = Platform.OS === 'ios' ? '' : Sound.MAIN_BUNDLE;
    const sound = new Sound(url, sb, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return Promise.reject({error: error.message});
      }
      dispatch(playStart());
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
          dispatch(playSuccess());

          // Add setTimeout here
          setTimeout(() => {
            const state2 = getState() as {audio: AudioState};
            if (state2.audio.playList.length > 0) {
              dispatch(playSound(state2.audio.playList[0]));
            }
          }, 1000);
        } else {
          console.log('Sound play failed');
          return Promise.reject({error: 'Sound play failed'});
        }
      });
    });
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
    playNext(state) {
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
    },
    playSuccess(state) {
      console.log('playSuccess was called');
      state.error = undefined;
      state.playingStatus = PlayingStatus.Stopped;
      state.currentUrl = undefined;
      state.playList = state.playList.slice(1);
    },
    playFailure(state, action) {
      state.playingStatus = PlayingStatus.Stopped;
      state.error = action.payload;
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

export const {addToPlayList, playNext, playStart, playSuccess, playFailure} =
  playlistSlice.actions;

export default playlistSlice.reducer;
