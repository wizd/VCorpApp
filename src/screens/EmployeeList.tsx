// Import React and React Native components
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Button,
  Image,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Header} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';

import EmployeeListItem from '../components/EmployeeListItem';
import AppContext, {Employee} from '../persist/AppContext';
import CustomButton from '../components/CustomButton';
import EditRoleModal from '../components/EditRoleModel';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeList = (props: Props) => {
  const navigation = useNavigation();
  const {company, setCompany} = useContext(AppContext);

  const [id, setId] = useState('' as string);
  const [curasst, setCurasst] = useState<Employee | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDelete = (veid: string) => {
    const newCompany = {
      ...company,
      employees: [...company.employees.filter(e => e.id !== veid)],
    };
    setCompany(newCompany);
  };

  const handleSave = (newName: string, newDescription: string) => {
    console.log('User entered name:', newName);
    const employee = company.employees.find(e => e.id === id);
    if (employee) {
      const newCompany = {
        ...company,
        employees: [
          ...company.employees.filter(e => e.id !== id),
          {...employee, name: newName, note: newDescription},
        ],
      };
      setCompany(newCompany);
    }
  };

  const veEdit = (veid: string) => {
    setId(veid);
    const emp = company.employees.find(e => e.id === veid);
    setCurasst(emp);
    openModal();
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

  const renderItem = (data: {item: Employee}) => (
    <EmployeeListItem
      assistant={data.item}
      onEdit={veid => veEdit(veid)}
      onSelect={veid => veSelected(veid)}
    />
  );

  const renderHiddenItem = (data: {item: Employee}) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => veEdit(data.item.id)}>
        <Text style={styles.backTextWhite}>定制</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDelete(data.item.id)}>
        <Text style={styles.backTextWhite}>炒掉</Text>
      </TouchableOpacity>
    </View>
  );

  // Return the JSX element that renders the page
  return (
    // Use a View component as a container for the page
    <View style={styles.pageContainer}>
      <Header
        leftComponent={
          <CustomButton onPress={() => navigation.goBack()} title="返回" />
        }
        centerComponent={{
          text: '公司员工列表',
          style: {color: '#fff', fontSize: 20},
        }}
        rightComponent={
          <CustomButton
            onPress={() => navigation.navigate('EmployeeMarket' as never)}
            title="招募"
          />
        }
        backgroundColor="#3D6DCC"
      />
      <View style={styles.container}>
        <SwipeListView
          data={company?.employees}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-150}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      </View>
      {/* <FlatList
        data={company?.employees} // Pass in the data source as a prop
        renderItem={({item}) => (
          <EmployeeListItem
            assistant={item}
            onEdit={veid => veEdit(veid)}
            onSelect={veid => veSelected(veid)}
          />
        )} // Pass in a function that returns an element for each item
        keyExtractor={item => item.id} // Pass in a function that returns a unique key for each item
      /> */}
      <EditRoleModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSave={handleSave}
        assistant={curasst!}
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
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});
