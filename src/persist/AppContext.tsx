import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LyraCrypto} from '../crypto/lyra-crypto';
import {Text} from 'react-native';
import axios from 'axios';
import {delay} from '../utils/util';

interface Config {
  API_URL: string;
  SECRET_KEY: string;
}

interface Settings {
  tts: boolean;
  guide?: boolean;
  autoSaveImage: boolean;
}
interface Employee {
  id: string;
  name: string;
  desc: string;
  avatar: string;
  note?: string;
}

interface Company {
  config: Config;
  settings: Settings;
  privatekey: string;
  name: string;
  curid: string;
  jwt?: string;
  employees: Employee[];
}

interface AppContextType {
  company: Company | null;
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

const AppContext = createContext<AppContextType>({
  company: null,
  setCompany: () => {},
});

const registerUser = async (apiUrl: string, privatekey: string) => {
  console.log('registering user to: ', apiUrl);
  const baseUrl = apiUrl + '/vc/v1/user';
  const usr = {
    accountId: LyraCrypto.GetAccountIdFromPrivateKey(privatekey),
  };
  const data = {
    user: usr,
    signature: LyraCrypto.Sign(JSON.stringify(usr), privatekey),
  };
  console.log('registering user with signature: ', data);

  while (true) {
    const api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    let jwt = '';
    try {
      const ret = await api.post('/register', data);
      console.log('register result: ', ret.data);
      if (ret.data.success) {
        jwt = ret.data.data.token as string;
        return jwt;
      } else {
        throw 'register failed';
      }
    } catch (error) {
      console.log('register error, entering endless loop: ', error);
      await delay(2000);
      continue;
    }
  }
};

const createDefaultCompany = async (): Promise<Company> => {
  console.log('createDefaultCompany is running');
  // create a default company, with 1 employee
  const wallet = LyraCrypto.GenerateWallet();
  console.log('wallet: ', wallet);
  console.log('wallet address: ', wallet.accountId);
  const defaultCompany: Company = {
    config: defaultConfig,
    settings: {tts: true, guide: true, autoSaveImage: false},
    privatekey: wallet.privateKey,
    name: 'Default Company',
    curid: 'A0001',
    employees: [
      {
        id: 'A0001',
        name: '晓玲珑',
        desc: '晓玲珑是一名助理，她的工作是帮助公司的老板完成一些日常的工作。',
        avatar: `${defaultConfig.API_URL}/assets/avatar/A0001.png`,
      },
    ],
  };
  console.log('defaultCompany: ', defaultCompany);
  return defaultCompany;
};

const storeName = '@company';

interface AppContextProviderProps {
  children: React.ReactNode;
}
const AppContextProvider: React.FC<AppContextProviderProps> = ({children}) => {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const loadCompanyData = async () => {
      console.log('loadCompanyData is running');
      try {
        const storedCompanyData = await AsyncStorage.getItem(storeName);
        //onsole.log('storedCompanyData:', storedCompanyData);
        if (storedCompanyData) {
          const saved = JSON.parse(storedCompanyData);
          if (saved.config.API_URL !== 'http://10.0.2.2:3001') {
            saved.config.API_URL = defaultConfig.API_URL;
          }
          setCompany(saved);
        } else {
          const defaultCompany = await createDefaultCompany();
          console.log('defaultCompany: ', defaultCompany);
          const jwt = await registerUser(
            defaultCompany.config.API_URL,
            defaultCompany.privatekey,
          );
          defaultCompany.jwt = jwt;
          setCompany(defaultCompany);
        }
      } catch (error) {
        console.error('Error loading company data:', error);
      }
    };

    loadCompanyData();
  }, []);

  useEffect(() => {
    async function saveData() {
      try {
        //console.log('Company updated and saved: ', company);
        await AsyncStorage.setItem(storeName, JSON.stringify(company));
      } catch (error) {
        console.log(error);
      }
    }

    if (company !== null) {
      saveData();
    } else {
      console.log('company is null, not saving.');
    }
  }, [company]);

  return (
    <AppContext.Provider value={{company, setCompany}}>
      {company ? children : <Text>初始化网络连接...</Text>}
    </AppContext.Provider>
  );
};
