import React, {FC} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Company} from '../persist/slices/company';
import {useDispatch, useSelector} from 'react-redux';
import RecordButton from '../components/tools/RecordButton';
import {setAIBusy} from '../persist/slices/companySlice';

interface Props {
  route: any;
  //   avatarUrl?: string;
  //   name?: string;
}

const VoiceChatScreen: FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;
  const navigation = useNavigation();
  const {avatarUrl, name} = route.params;
  const windowDimensions = useWindowDimensions();
  const isLandscape = windowDimensions.width > windowDimensions.height;

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
          <Image
            source={{
              uri: avatarUrl,
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{name ?? company.curid}</Text>
        </View>
        <View style={styles.loading}>
          {company.isAILoading && (
            <ActivityIndicator size="large" color="#0000ff" />
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
