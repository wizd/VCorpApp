// Import React and React Native components
import React, {useContext, useEffect, useState} from 'react';
import {View, Button, Image, StyleSheet, FlatList} from 'react-native';
import {Header} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import EmployeeListItem from '../components/EmployeeListItem';
import AppContext from '../persist/AppContext';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeList = (props: Props) => {
  const navigation = useNavigation();
  const {company, setCompany} = useContext(AppContext);

  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  const handleNameChange = (id: string, name: string) => {
    const employee = company.employees.find(e => e.id === id);
    if (employee) {
      const newCompany = {
        ...company,
        employees: [
          ...company.employees.filter(e => e.id !== id),
          {...employee, name},
        ],
      };
      setCompany(newCompany);
    }
  };

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
        data={company?.employees} // Pass in the data source as a prop
        renderItem={({item}) => (
          <EmployeeListItem assistant={item} changeName={handleNameChange} />
        )} // Pass in a function that returns an element for each item
        keyExtractor={item => item.id} // Pass in a function that returns a unique key for each item
      />
    </View>
  );
};

// Export default EmployeeList

export default EmployeeList;

// Define some styles for different elements

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
