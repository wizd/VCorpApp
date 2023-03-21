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

// Define the props of the custom component that renders each item
type ItemProps = {
  item: Employee; // The item object
};

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

// Define the custom component that renders each item
const EmployeeListItem = ({item}: ItemProps) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const handleNameSubmit = (name: string | undefined) => {
    console.log('User entered name:', name);
    setIsPromptVisible(false);
    navigation.navigate('ShortCuts' as never, {name: name} as never);
  };

  const handleNameCancel = () => {
    console.log('User canceled the prompt');
    setIsPromptVisible(false);
  };

  // Define a function that handles the user selection of an item
  const handlePress = () => {
    // show an alert dialog with a text input
    console.log('handlePress on recuite');
    Alert.prompt(
      'Enter your name',
      'What do you want to name your character?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: value => {
            // save the name to the state
            setName(value!);
            // navigate to another screen with the name as a parameter
            navigation.navigate('ShortCuts' as never, {name: value} as never);
          },
        },
      ],
      // set the alert type to plain-text
      'plain-text',
    );
  };

  // Return the JSX element that renders each item
  return (
    // Use a View component as a container for each item
    <View style={styles.itemContainer}>
      <TouchableOpacity>
        <Image
          source={{uri: `${API_URL}/assets/avatar/${item.avatar}`}}
          style={styles.itemImage}
        />
      </TouchableOpacity>
      <View style={styles.itemTextContainer}>
        <TouchableOpacity onPress={() => setIsPromptVisible(true)}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.desc}</Text>
            {/* <TextButton title="招募" onPress={() => setIsPromptVisible(true)} /> */}
            <CustomPrompt
              isVisible={isPromptVisible}
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
