import React, {FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RectButton} from 'react-native-gesture-handler';
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

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRecordDone = (msgid: string) => {
    //onSendVoice(msgid);
    dispatch(setAIBusy(true));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeButton}>关闭</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image
          source={{
            uri: avatarUrl,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name ?? company.curid}</Text>
        <View style={styles.loading}>
          {company.isAILoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
        <RecordButton
          buttonStyle={styles.talkButton}
          textStyle={styles.talkButtonText}
          onRecordComplete={handleRecordDone}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 32,
  },
  talkButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 100,
  },
  talkButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default VoiceChatScreen;
