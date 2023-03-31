// Import React and React Native components
import React, {useContext, useEffect, useState} from 'react';
import {View, Button, Image, StyleSheet, FlatList} from 'react-native';
import {Header} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

import EmployeeListItem from '../components/EmployeeListItem';
import AppContext from '../persist/AppContext';
import CustomPrompt from '../components/CustomPrompt';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeList = (props: Props) => {
  const navigation = useNavigation();
  const {company, setCompany} = useContext(AppContext);

  const [id, setId] = useState('' as string);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const handleNameSubmit = (name: string | undefined) => {
    console.log('User entered name:', name);
    setIsPromptVisible(false);
    handleNameChange(name as string);
    navigation.navigate('ShortCuts' as never, {name: name} as never);
  };

  const handleNameCancel = () => {
    console.log('User canceled the prompt');
    setIsPromptVisible(false);
  };

  const handleDelete = () => {
    setIsPromptVisible(false);
    const newCompany = {
      ...company,
      employees: [...company.employees.filter(e => e.id !== id)],
    };
    setCompany(newCompany);
  };

  const handleNameChange = (name: string) => {
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

  const veEdit = (veid: string) => {
    setId(veid);
    setIsPromptVisible(true);
  };

  const veSelected = (veid: string) => {
    // change curid of company
    const newCompany = {
      ...company,
      curid: veid,
    };
    setCompany(newCompany);
    navigation.navigate('ShortCuts' as never);
  };

  // Return the JSX element that renders the page
  return (
    // Use a View component as a container for the page
    <View style={styles.pageContainer}>
      <Header
        leftComponent={
          <Button
            color="#fff"
            onPress={() => navigation.goBack()}
            title="返回"
          />
        }
        centerComponent={{
          text: '公司员工列表',
          style: {color: '#fff', fontSize: 20},
        }}
        rightComponent={
          <Button
            color="#fff"
            onPress={() => navigation.navigate('EmployeeMarket' as never)}
            title="招募"
          />
        }
        backgroundColor="#3D6DCC"
      />
      <FlatList
        data={company?.employees} // Pass in the data source as a prop
        renderItem={({item}) => (
          <EmployeeListItem
            assistant={item}
            onEdit={veid => veEdit(veid)}
            onSelect={veid => veSelected(veid)}
          />
        )} // Pass in a function that returns an element for each item
        keyExtractor={item => item.id} // Pass in a function that returns a unique key for each item
      />
      <CustomPrompt
        isVisible={isPromptVisible}
        title="改名"
        message="请输入新名字"
        onSubmit={handleNameSubmit}
        onCancel={handleNameCancel}
        onDelete={handleDelete}
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
  titleButton: {
    color: '#fff',
  },
});
