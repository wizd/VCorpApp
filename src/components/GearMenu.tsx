import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dialog} from '@rneui/themed';

interface GearMenuProps {
  onSettingsPress: () => void;
  onRefreshPress: () => void;
}

const GearMenu: React.FC<GearMenuProps> = ({
  onSettingsPress,
  onRefreshPress,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={showDialog} style={styles.iconContainer}>
        <Icon name="gear" size={24} />
      </TouchableOpacity>
      <Dialog isVisible={dialogVisible} onBackdropPress={hideDialog}>
        <Dialog.Title title="操作" />
        <Dialog.Actions>
          <Dialog.Button
            title="翻译"
            onPress={() => {
              onSettingsPress();
              hideDialog();
            }}
          />
          <Dialog.Button
            title="设置"
            onPress={() => {
              onSettingsPress();
              hideDialog();
            }}
          />
          <Dialog.Button
            title="刷新"
            onPress={() => {
              onRefreshPress();
              hideDialog();
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GearMenu;
