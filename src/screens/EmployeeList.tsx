// Import React and React Native components
import React, {useEffect, useState} from 'react';
import {View, Button, Image, StyleSheet, FlatList} from 'react-native';
import {Header} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {API_URL, SECRET_KEY} from '@env';

import * as PersistentStorage from '../storage';
import EmployeeListItem from '../components/EmployeeListItem';
import {LyraCrypto} from '../crypto/lyra-crypto';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeList = (props: Props) => {
  const navigation = useNavigation();

  const [company, setCompany] = useState<PersistentStorage.Company | null>(
    null,
  );

  useEffect(() => {
    PersistentStorage.getCompany().then(compstor => {
      if (compstor == null) {
        // create a default company, with 1 employee
        const defaultCompany: PersistentStorage.Company = {
          privatekey: LyraCrypto.GenerateWallet().privateKey,
          name: 'Default Company',
          employees: [
            {
              id: 'A0001',
              name: '助理小美',
              desc: '助理小美是一名助理，她的工作是帮助公司的老板完成一些日常的工作。',
              avatar: `${API_URL}/assets/avatar/A0001`,
            },
          ],
        };
        PersistentStorage.setCompany(defaultCompany);
        setCompany(defaultCompany);
      } else setCompany(compstor);
    });
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
        data={company?.employees} // Pass in the data source as a prop
        renderItem={({item}) => <EmployeeListItem item={item} />} // Pass in a function that returns an element for each item
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
