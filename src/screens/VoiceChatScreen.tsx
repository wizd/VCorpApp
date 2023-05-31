import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Company} from '../persist/slices/company';
import {useDispatch, useSelector} from 'react-redux';
import RecordButton from '../components/tools/RecordButton';
import {setAIBusy} from '../persist/slices/companySlice';
import {AudioState, PlayingStatus} from '../persist/slices/playlistSlice';

interface Props {
  route: any;
  //   avatarUrl?: string;
  //   name?: string;
}

const VoiceChatScreen: FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;
  const audio = useSelector((state: any) => state.audio) as AudioState;
  const navigation = useNavigation();
  const {avatarUrl, name} = route.params;
  const windowDimensions = useWindowDimensions();
  const isLandscape = windowDimensions.width > windowDimensions.height;
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isCancelled = false;

    const animateGlow = () => {
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(({finished}) => {
        if (
          !isCancelled &&
          finished &&
          audio.playingStatus === PlayingStatus.InPlaying
        ) {
          animateGlow();
        }
      });
    };

    if (audio.playingStatus === PlayingStatus.InPlaying) {
      animateGlow();
    }

    return () => {
      isCancelled = true;
      animationValue.stopAnimation();
      animationValue.setValue(0); // 重置动画值
    };
  }, [audio.playingStatus]);

  const glowOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const avatarScale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRecordDone = () => {
    //onSendVoice(msgid);
    dispatch(setAIBusy(true));
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
    },
    contentLandscape: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentPortrait: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftSide: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: isLandscape ? 30 : 0,
    },
    rightSide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingVertical: 16,
    },
    header: {
      paddingTop: 10,
      paddingHorizontal: 10,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    closeButton: {
      fontSize: 16,
      color: '#000000',
    },
    avatar: {
      width: 256,
      height: 256,
      borderRadius: 8,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 30,
    },
    loading: {
      marginLeft: isLandscape ? 32 : 0,
      marginTop: isLandscape ? 0 : 32,
    },
    talkButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 30,
      marginLeft: isLandscape ? 100 : 0,
      marginTop: isLandscape ? 0 : 100,
    },
    talkButtonText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    avatarContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    glow: {
      position: 'absolute',
      top: -10,
      left: -10,
      right: -10,
      bottom: -10,
      borderRadius: 8,
      borderWidth: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeButton}>关闭</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.content,
          isLandscape ? styles.contentLandscape : styles.contentPortrait,
        ]}>
        <View style={styles.leftSide}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {transform: [{scale: avatarScale}]},
            ]}>
            <Image
              source={{
                uri: avatarUrl,
              }}
              style={styles.avatar}
            />
            <Animated.View
              style={[
                styles.glow,
                {opacity: glowOpacity, borderColor: 'rgba(0, 0, 255, 0.5)'},
              ]}
            />
          </Animated.View>
          <Text style={styles.name}>{name ?? company.curid}</Text>
        </View>
        <View style={styles.loading}>
          {company.isAILoading && (
            <ActivityIndicator
              size="large"
              color="#000000"
              style={{transform: [{scale: 2}]}} // 放大指示器
            />
          )}
        </View>
        <View style={styles.rightSide}>
          <RecordButton
            buttonStyle={styles.talkButton}
            textStyle={styles.talkButtonText}
            onRecordComplete={handleRecordDone}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VoiceChatScreen;
