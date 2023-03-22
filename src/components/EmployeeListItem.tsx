import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {API_URL, SECRET_KEY} from '@env';
import CustomPrompt from './CustomPrompt';
import {Employee} from '../storage';

type TextButtonType = {
  title: string;
  onPress: () => void;
};
const TextButton = ({title, onPress}: TextButtonType) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.itemButton}>{title}</Text>
    </TouchableOpacity>
  );
};

// Define the props of the custom component that renders each item
type ItemProps = {
  assistant: Employee; // The item object
  changeName: (id: string, name: string) => void;
};

// Define the custom component that renders each item
const EmployeeListItem = (props: ItemProps) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const handleNameSubmit = (name: string | undefined) => {
    console.log('User entered name:', name);
    setIsPromptVisible(false);
    props.changeName(props.assistant.id, name as string);
    navigation.navigate('ShortCuts' as never, {name: name} as never);
  };

  const handleNameCancel = () => {
    console.log('User canceled the prompt');
    setIsPromptVisible(false);
  };

  // Return the JSX element that renders each item
  return (
    // Use a View component as a container for each item
    <View style={styles.itemContainer}>
      <TouchableOpacity>
        <Image
          source={{uri: props.assistant.avatar}}
          style={styles.itemImage}
        />
      </TouchableOpacity>
      <View style={styles.itemTextContainer}>
        <TouchableOpacity onPress={() => setIsPromptVisible(true)}>
          <View>
            <Text style={styles.itemName}>{props.assistant.name}</Text>
            <Text style={styles.itemDesc}>{props.assistant.desc}</Text>
            {/* <TextButton title="招募" onPress={() => setIsPromptVisible(true)} /> */}
            <CustomPrompt
              isVisible={isPromptVisible}
              title="改名"
              message="请输入新名字"
              onSubmit={handleNameSubmit}
              onCancel={handleNameCancel}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
  },

  itemTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },

  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  itemDesc: {
    fontSize: 14,
    color: '#777',
  },
  itemButton: {
    fontSize: 10,
    color: 'blue',
    paddingTop: 5,
    textAlign: 'right',
  },
});

export default EmployeeListItem;
