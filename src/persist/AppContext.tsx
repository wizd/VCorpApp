import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, SECRET_KEY} from '@env';
import {LyraCrypto} from '../crypto/lyra-crypto';

export interface Employee {
  id: string;
  name: string;
  desc: string;
  avatar: string;
}

export interface Company {
  privatekey: string;
  name: string;
  curid: string;
  employees: Employee[];
}

interface AppContextType {
  company: Company | null;
  setCompany: (company: Company) => void;
}

const AppContext = createContext<AppContextType>({
  company: null,
  setCompany: () => {},
});

const storeName = '@company';

export const AppContextProvider: React.FC = ({children}) => {
  const [company, setCompany] = useState<Company | null>(null);

  const createDefaultCompany = (): Company => {
    // create a default company, with 1 employee
    const wallet = LyraCrypto.GenerateWallet();
    console.log('wallet address: ', wallet.accountId);
    const defaultCompany: PersistentStorage.Company = {
      privatekey: wallet.privateKey,
      name: 'Default Company',
      curid: 'A0001',
      employees: [
        {
          id: 'A0001',
          name: '助理小美',
          desc: '助理小美是一名助理，她的工作是帮助公司的老板完成一些日常的工作。',
          avatar: `${API_URL}/assets/avatar/A0001.png`,
        },
      ],
    };
    return defaultCompany;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const value = await AsyncStorage.getItem(storeName);
        if (value !== null) {
          setCompany(JSON.parse(value));
          console.log('@company loaded from storage: ', value);
        } else {
          const defaultCompany = createDefaultCompany();
          setCompany(defaultCompany);
        }
      } catch (error) {
        const defaultCompany = createDefaultCompany();
        setCompany(defaultCompany);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    async function saveData() {
      try {
        await AsyncStorage.setItem(storeName, JSON.stringify(company));
      } catch (error) {
        console.log(error);
      }
    }

    saveData();
  }, [company]);

  return (
    <AppContext.Provider value={{company, setCompany}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
