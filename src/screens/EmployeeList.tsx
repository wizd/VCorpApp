// Import React and React Native components
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DeviceInfo from 'react-native-device-info';

import EmployeeListItem from '../components/EmployeeListItem';
import CustomButton from '../components/tools/CustomButton';
import EditRoleModal from '../components/EditRoleModel';
import { useDispatch, useSelector } from 'react-redux';
import { Company, Employee } from '../persist/slices/company';
import {
  chooseEmployee,
  fireEmployee,
  updateEmployee,
} from '../persist/slices/companySlice';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeList = (props: Props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;

  const [id, setId] = useState('' as string);
  const [curasst, setCurasst] = useState<Employee | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);

  const [heightDelta, setHeightDelta] = useState(0 as number);

  useEffect(() => {
    const devid = DeviceInfo.getDeviceId();
    if (devid.includes('iPhone')) {
      const digits = +devid.replace('iPhone', '').replace(',', '');
      if (digits < 100) {
        setHeightDelta(-10);
      }
    }
  }, []);

  // useEffect(() => {
  //   const loadData = async () => {
  //     if (company) {
  //       // we need to update info for all employees
  //       const employeeIds = company.employees.map(employee => employee.id);
  //       const combinedIds = employeeIds.join(',');
  //     }
  //   };

  //   // Use an immediately invoked async function to handle loadData and register
  //   (async () => {
  //     try {
  //       await loadData();
  //     } catch (error) {
  //       console.log('in await loadData', error);
  //     }
  //   })();
  // }, [company]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDelete = (veid: string) => {
    dispatch(fireEmployee(veid));
  };

  const handleSave = (newName: string, newDescription?: string) => {
    console.log('User entered name:', newName);
    dispatch(updateEmployee({ id, name: newName, note: newDescription }));
  };

  const veEdit = (veid: string) => {
    setId(veid);
    const emp = company.employees.find(e => e.id === veid);
    setCurasst(emp);
    openModal();
  };

  const veSelected = (veid: string) => {
    dispatch(chooseEmployee(veid));
    navigation.navigate('ShortCuts' as never);
  };

  const renderItem = (data: { item: Employee }) => (
    <EmployeeListItem
      assistant={data.item}
      onEdit={veid => veEdit(veid)}
      onSelect={veid => veSelected(veid)}
    />
  );

  const renderHiddenItem = (data: { item: Employee }) => (
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
        containerStyle={{ marginTop: heightDelta }}
        leftComponent={
          <CustomButton onPress={() => navigation.goBack()} title="返回" />
        }
        centerComponent={{
          text: '公司员工列表',
          style: { color: '#fff', fontSize: 20 },
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
