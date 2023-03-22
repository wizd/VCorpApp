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
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
};

// Define the custom component that renders each item
const EmployeeListItem = (props: ItemProps) => {
  // Return the JSX element that renders each item
  return (
    // Use a View component as a container for each item
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => props.onEdit(props.assistant.id)}>
        <Image
          source={{
            uri: props.assistant.avatar.startsWith('http')
              ? props.assistant.avatar
              : API_URL + '/assets/avatar/' + props.assistant.avatar,
          }}
          style={styles.itemImage}
        />
      </TouchableOpacity>
      <View style={styles.itemTextContainer}>
        <TouchableOpacity onPress={() => props.onSelect(props.assistant.id)}>
          <View>
            <Text style={styles.itemName}>{props.assistant.name}</Text>
            <Text style={styles.itemDesc}>{props.assistant.desc}</Text>
            {/* <TextButton title="招募" onPress={() => setIsPromptVisible(true)} /> */}
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
