import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Employee {
  id: string;
  name: string;
  desc: string;
  avatar: string;
}

export interface Company {
  privatekey: string;
  name: string;
  employees: Employee[];
}

export const getCompany = async (): Promise<Company | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@company');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const setCompany = async (company: Company): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(company);
    await AsyncStorage.setItem('@company', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const modifyCompanyName = async (name: string): Promise<void> => {
  const company = await getCompany();
  if (company) {
    company.name = name;
    await setCompany(company);
  }
};

export const addEmployee = async (employee: Employee): Promise<void> => {
  const company = await getCompany();
  if (company) {
    company.employees.push(employee);
    await setCompany(company);
  }
};

export const removeEmployee = async (employeeId: string): Promise<void> => {
  const company = await getCompany();
  if (company) {
    company.employees = company.employees.filter(
      employee => employee.id !== employeeId,
    );
    await setCompany(company);
  }
};

export const modifyEmployee = async (employee: Employee): Promise<void> => {
  const company = await getCompany();
  if (company) {
    const index = company.employees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      company.employees[index] = employee;
      await setCompany(company);
    }
  }
};
