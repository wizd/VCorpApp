import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Platform} from 'react-native';
import Sound from 'react-native-sound';

export type Playing = {
  url: string | undefined;
  sound: Sound | null;
};

interface AudioContextType {
  addToPlayList: (url: string) => void;
  playOrPause: (url: string) => void;
  stopAndPlay: (url: string) => void;
  playNext: () => void;
  currentPlaying: Playing | null;
  canPlay: boolean;
}

const AudioContext = createContext<AudioContextType>({
  addToPlayList: () => {},
  playOrPause: () => {},
  stopAndPlay: () => {},
  playNext: () => {},
  currentPlaying: null,
  canPlay: false,
});

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({children}) => {
  const [playList, setPlayList] = useState<string[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<Playing | null>(null);

  const canPlay = playList.length > 0;

  const addToPlayList = (url: string) => {
    setPlayList(prevList => {
      if (prevList.length > 0 && prevList[prevList.length - 1] === url) {
        console.log(
          'URL is already the last in the playlist, no need to add again',
        );
        return prevList;
      } else {
        console.log('addToPlayList: ', url);
        return [...prevList, url];
      }
    });

    if (currentPlaying === null && canPlay) {
      console.log('addToPlayList: currentPlaying is null, playNext()');
      playNext();
    }
  };

  const playNext = useCallback(() => {
    console.log('playNext: ', playList);
    const nextUrl = playList.shift(); // Remove the first url from the playlist
    if (nextUrl === undefined) {
      currentPlaying?.sound?.release();
      setCurrentPlaying(null);
      return; // If no more urls, return
    }

    // clean current playing
    currentPlaying?.sound?.release();

    const sb = Platform.OS === 'ios' ? '' : Sound.MAIN_BUNDLE;
    const s = new Sound(nextUrl, sb, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log('Sound is now playing: ', nextUrl);
      setCurrentPlaying({url: nextUrl, sound: s});
      s.play(success => {
        console.log('s.play(success: ', success);
        if (success) {
          console.log('successfully finished playing', currentPlaying?.url);
          playNext();
          // When this sound finishes, play the next one
        }
      });
    });
  }, [playList]);

  // Whenever the playList updates, check if we should start playing
  useEffect(() => {
    console.log('useEffect: playList: ', playList);
    if (playList.length > 0) {
      playNext();
    }
  }, [playList, playNext]);

  const playOrPause = (wavurl: string) => {
    if (currentPlaying !== null) {
      if (currentPlaying.sound?.isPlaying()) {
        currentPlaying.sound?.pause();
      } else {
        currentPlaying.sound?.play();
      }
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
        addToPlayList,
        playNext,
        currentPlaying,
        canPlay,
      }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
