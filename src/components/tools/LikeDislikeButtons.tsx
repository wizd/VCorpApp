import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';

interface LikeDislikeButtonsProps {
  content: string;
}

const LikeDislikeButtons: React.FC<LikeDislikeButtonsProps> = ({content}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const showToast = () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '',
      text2: '内容已复制到剪贴板',
    });
  };

  const handleCopy = () => {
    Clipboard.setString(content);
    showToast();
  };

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
      {/* <TouchableOpacity onPress={handleCopy}>
        <MaterialIcons
          style={styles.icons}
          name={'hearing'}
          size={14}
          color="lightgrey"
        />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={handleCopy}>
        <MaterialIcons
          style={styles.icons}
          name={'content-copy'}
          size={14}
          color="grey"
        />
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={onLikePress} style={styles.dislikeIcon}>
        <MaterialIcons
          name={liked ? 'thumb-up' : 'thumb-up-off-alt'}
          size={16}
          color="grey"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDislikePress} style={styles.dislikeIcon}>
        <MaterialIcons
          name={disliked ? 'thumb-down' : 'thumb-down-off-alt'}
          size={16}
          color="grey"
        />
      </TouchableOpacity> */}
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
  icons: {
    padding: 5,
  },
});

export default LikeDislikeButtons;
