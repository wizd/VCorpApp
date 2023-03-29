import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface GearMenuProps {
  onSettingsPress: () => void;
  onRefreshPress: () => void;
}

const GearMenu: React.FC<GearMenuProps> = ({
  onSettingsPress,
  onRefreshPress,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu} style={styles.iconContainer}>
        <Icon name="gear" size={24} />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={onSettingsPress} style={styles.menuItem}>
            <Text>设置</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRefreshPress} style={styles.menuItem}>
            <Text>刷新</Text>
          </TouchableOpacity>
        </View>
      )}
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
  menu: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuItem: {
    padding: 10,
  },
});

export default GearMenu;
