import React, {useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAudio} from '../../persist/AudioContext';

const PlayerControls: React.FC = () => {
  const {
    playOrPause,
    playNext,
    stop,
    playList,
    currentPlaying,
    canPlay,
    isPaused,
  } = useAudio();

  const handlePlayPause = () => {
    // Assuming your playOrPause function accepts a URL
    playOrPause('your-url-here');
  };

  const handleNext = () => {
    playNext();
  };

  const handleStop = () => {
    stop();
  };

  useEffect(() => {
    // Assuming your playOrPause function accepts a URL
    console.log('currentUrl is: ', currentPlaying?.url, 'can play? ', canPlay);
  }, [canPlay, currentPlaying]);

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={handleStop} disabled={currentPlaying === null}>
        <Icon
          name="stop"
          size={32}
          color={currentPlaying !== null ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePlayPause}
        disabled={!canPlay && currentPlaying === null}>
        <Icon
          name={isPaused ? 'play-arrow' : 'pause'}
          size={32}
          color={canPlay || currentPlaying !== null ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext} disabled={playList.length <= 1}>
        <Icon
          name="skip-next"
          size={32}
          color={playList.length > 1 ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerControls;
