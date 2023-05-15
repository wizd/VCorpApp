import React, {useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAudio} from '../../persist/AudioContext';

const PlayerControls: React.FC = () => {
  const {playOrPause, currentPlaying, canPlay} = useAudio();

  const handlePlayPause = () => {
    // Assuming your playOrPause function accepts a URL
    playOrPause('your-url-here');
  };

  const handleNext = () => {};

  useEffect(() => {
    // Assuming your playOrPause function accepts a URL
    console.log('currentUrl is: ', currentPlaying?.url, 'can play? ', canPlay);
  }, [canPlay, currentPlaying]);

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={handlePlayPause}>
        <Icon
          name={currentPlaying !== null ? 'pause' : 'play-arrow'}
          size={24}
          color={canPlay || currentPlaying !== null ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext}>
        <Icon name="skip-next" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerControls;
