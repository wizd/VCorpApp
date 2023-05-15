import React, {createContext, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import Sound from 'react-native-sound';
import {useToast} from '../utils/useToast';

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

interface AudioContextType {
  addToPlayList: (url: string) => void;
  playOrPause: (url: string) => void;
  playNext: () => void;
  stopAndPlay: (url: string) => void;
  playList: string[];
  currentPlaying: Playing | null;
  currentUrl: string | null;
  canPlay: boolean;
  isPaused: boolean;
}

const AudioContext = createContext<AudioContextType>({
  addToPlayList: () => {},
  playOrPause: () => {},
  playNext: () => {},
  stopAndPlay: () => {},
  playList: [],
  currentPlaying: null,
  currentUrl: null,
  canPlay: false,
  isPaused: false,
});

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({children}) => {
  const [playList, setPlayList] = useState<string[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<Playing | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const showToast = useToast();

  const addToPlayList = (url: string) => {
    setPlayList(prevList => {
      if (prevList.length > 0 && prevList[prevList.length - 1] === url) {
        showToast('已经添加到了列表中');
        return prevList;
      } else {
        showToast('成功加入播放列表');
        return [...prevList, url];
      }
    });

    if (currentPlaying === null && canPlay) {
      console.log('addToPlayList: currentPlaying is null, playNext()');
    }
  };

  // Whenever the playList updates, check if we should start playing
  useEffect(() => {
    console.log(
      'playList updated: ',
      playList,
      'currentPlaying: ',
      currentPlaying,
      'currentUrl: ',
      currentUrl,
      'canPlay: ',
      canPlay,
    );
    const playNext = () => {
      if (!playList.length) {
        return;
      }

      // Release current sound
      if (currentPlaying) {
        currentPlaying?.sound?.release();
      }

      // Play next sound
      const nextUrl = playList[0];
      const sb = Platform.OS === 'ios' ? '' : Sound.MAIN_BUNDLE;
      const s = new Sound(nextUrl, sb, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        setCurrentPlaying(new Playing(nextUrl, s));
        s.play(success => {
          if (success) {
            // Remove played sound from playlist
            showToast('Sound played successfully');
            currentPlaying?.release();
            setCurrentPlaying(null);
            setPlayList(currentList => currentList.slice(1));
          }
        });
      });
    };

    if (!currentPlaying && playList.length > 0) {
      playNext();
    }
    setCurrentUrl(playList[0]);
    setCanPlay(playList.length > 0);
  }, [playList]); // Recreate playNext when playList changes

  const playOrPause = (wavurl: string) => {
    if (currentPlaying !== null) {
      if (currentPlaying.sound?.isPlaying()) {
        currentPlaying.sound?.pause();
        setIsPaused(true);
      } else {
        currentPlaying.sound?.play();
        setIsPaused(false);
      }
    }
  };

  const playNext = () => {
    // stop current sound
    if (currentPlaying) {
      currentPlaying.sound?.stop();
      currentPlaying.sound?.release();
      setCurrentPlaying(null);
    }

    if (playList.length > 1) {
      // Check if there is a next song
      const nextPlayList = [...playList];
      nextPlayList.shift(); // Remove the first song from the playlist
      setPlayList(nextPlayList); // Set the new playlist
    } else {
      showToast('This is the last song in the playlist.');
    }
  };

  const stopAndPlay = (wavurl: string) => {
    // if (sound) {
    //   sound.release();
    //   setSound(null);
    // }
    // playOrPause(wavurl);
  };

  return (
    <AudioContext.Provider
      value={{
        playOrPause,
        stopAndPlay,
        playNext,
        addToPlayList,
        playList,
        currentPlaying,
        canPlay,
        currentUrl,
        isPaused,
      }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
