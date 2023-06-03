import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Header} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import CustomButton from './tools/CustomButton';
import DeviceInfo from 'react-native-device-info';

interface FullScreenDialogProps {
  title: string;
  children: React.ReactNode;
}

const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
  title,
  children,
}) => {
  const navigation = useNavigation();

  const [heightDelta, setHeightDelta] = useState(0 as number);

  useEffect(() => {
    const devid = DeviceInfo.getDeviceId();
    if (devid.includes('iPhone')) {
      const digits = +devid.replace('iPhone', '').replace(',', '');
      if (digits < 100) {
        setHeightDelta(-10);
      }
    }
  }, []);

  return (
    <View style={styles.pageContainer}>
      <Header
        containerStyle={{marginTop: heightDelta}}
        leftComponent={
          <CustomButton onPress={() => navigation.goBack()} title="返回" />
        }
        centerComponent={{
          text: title,
          style: {color: '#fff', fontSize: 22, fontWeight: 'bold'},
        }}
        backgroundColor="#3D6DCC"
      />

      <View style={styles.container}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
});

export default FullScreenDialog;
