import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LikeDislikeButtons: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const onLikePress = () => {
    setLiked(!liked);
    if (disliked) {
      setDisliked(false);
    }
  };

  const onDislikePress = () => {
    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLikePress}>
        <MaterialIcons
          name={liked ? 'thumb-up' : 'thumb-up-off-alt'}
          size={16}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDislikePress} style={styles.dislikeIcon}>
        <MaterialIcons
          name={disliked ? 'thumb-down' : 'thumb-down-off-alt'}
          size={16}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dislikeIcon: {
    marginLeft: 10,
  },
});

export default LikeDislikeButtons;
