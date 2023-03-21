// Import React and React Native components
import React, {useEffect, useState} from 'react';
import {View, Button, Image, StyleSheet, FlatList} from 'react-native';
import {Header} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {API_URL, SECRET_KEY} from '@env';

import * as PersistentStorage from '../storage';
import EmployeeListItem from '../components/EmployeeListItem';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeMarket = (props: Props) => {
  const navigation = useNavigation();

  const [data, setData] = useState<PersistentStorage.Employee[]>([]);

  useEffect(() => {
    const url = API_URL + '/vc/v1/ve/list';
    // Fetch the data from the url, and set data to the returned data
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: SECRET_KEY,
      },
    })
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  // Return the JSX element that renders the page
  return (
    // Use a View component as a container for the page
    <View style={styles.pageContainer}>
      <Header
        leftComponent={
          <Button onPress={() => navigation.goBack()} title="Back" />
        }
        centerComponent={{text: '公司员工列表', style: {color: '#fff'}}}
        rightComponent={
          <Button onPress={() => alert('This is a button!')} title="招募" />
        }
        backgroundColor="#3D6DCC"
      />
      <FlatList
        data={data} // Pass in the data source as a prop
        renderItem={({item}) => <EmployeeListItem item={item} />} // Pass in a function that returns an element for each item
        keyExtractor={item => item.id} // Pass in a function that returns a unique key for each item
      />
    </View>
  );
};

// Export default EmployeeList

export default EmployeeMarket;

// Define some styles for different elements

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
