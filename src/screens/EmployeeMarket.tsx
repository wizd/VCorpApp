// Import React and React Native components
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

import EmployeeListItem from '../components/EmployeeListItem';

import CustomButton from '../components/tools/CustomButton';
import FilterRoleModal from '../components/FilterRoleModal';
import { useDispatch, useSelector } from 'react-redux';
import { Company, Employee } from '../persist/slices/company';
import { hireNewEmployee } from '../persist/slices/companySlice';

// Define the props of the main component that renders the page
type Props = {};

// Define the main component that renders the page
const EmployeeMarket = (props: Props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;

  const [datafull, setDataFull] = useState<Employee[]>([]);
  const [data, setData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

    const url = company.config.API_URL + '/vc/v1/ve/list';
    // Fetch the data from the url, and set data to the returned data
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: company.config.SECRET_KEY,
      },
    })
      .then(response => response.json())
      .then(json => {
        setDataFull(json);
        setData(json);
        setIsLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  const onEdit = (veid: string) => {
    console.log('edit ' + veid);
  };

  const onFilter = (
    hired: boolean | null,
    category: string | null,
    isFree: boolean | null,
  ) => {
    console.log('filter ');
    let result = datafull;
    if (hired != null) {
      if (hired) {
        result = datafull.filter(e =>
          company.employees.find(ee => ee.id === e.id),
        );
      } else {
        result = datafull.filter(
          e => !company.employees.find(ee => ee.id === e.id),
        );
      }
    }
    if (category != null) {
      result = result.filter(e => e.id.startsWith(category));
    }
    setData(result);
  };

  const veSelected = (veid: string) => {
    console.log('will hire ' + veid);
    if (company.employees.find(e => e.id === veid)) {
      Alert.alert('已经雇佣过了');
      return;
    } else {
      const employee = data.find(e => e.id === veid);
      dispatch(hireNewEmployee(employee as Employee));
    }
    navigation.goBack();
  };

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
          text: '虚拟员工市场',
          style: { color: '#fff', fontSize: 20 },
        }}
        rightComponent={
          <CustomButton onPress={() => setModalVisible(true)} title="过滤" />
        }
        backgroundColor="#3D6DCC"
      />
      <View style={styles.outerContainer}>
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={data} // Pass in the data source as a prop
            renderItem={({ item }) => (
              <EmployeeListItem
                assistant={item}
                onSelect={id => veSelected(id)}
                onEdit={onEdit}
              />
            )} // Pass in a function that returns an element for each item
            keyExtractor={item => item.id} // Pass in a function that returns a unique key for each item
          />
        )}
      </View>
      <FilterRoleModal
        isVisible={isModalVisible}
        onFilter={onFilter}
        onClose={() => setModalVisible(false)}
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
  outerContainer: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexGrow: 1,
  },
});
