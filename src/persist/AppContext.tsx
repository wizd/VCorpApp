import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LyraCrypto} from '../crypto/lyra-crypto';
import {Text} from 'react-native';
import axios from 'axios';

export let API_URL_DEFAULT = 'https://mars.vcorp.ai';
// fuck various dotenv configs. let's just hardcode the default config here.
const defaultConfig = {
  // for local dev: remove app, set this to http://10.0.2.2:3001, run just once.
  // default set to 'https://mars.vcorp.ai'
  API_URL: API_URL_DEFAULT,
  SECRET_KEY: '5f7b9b9b-3b5c-4b9c-9c9b-5f7b9b9b3b5c',
};

export interface Config {
  API_URL: string;
  SECRET_KEY: string;
}

export interface Settings {
  tts: boolean;
  guide: boolean;
  autoSaveImage: boolean;
}
export interface Employee {
  id: string;
  name: string;
  desc: string;
  avatar: string;
  note?: string;
}

export interface Company {
  config: Config;
  settings: Settings;
  privatekey: string;
  name: string;
  curid: string;
  jwt: string;
  employees: Employee[];
}

interface AppContextType {
  company: Company | null;
  setCompany: (updateFunction: (company: Company | null) => Company) => void;
}

const AppContext = createContext<AppContextType>({
  company: null,
  setCompany: () => {},
});

const registerUser = async (apiUrl: URL, privatekey: string) => {
  const baseUrl = apiUrl + '/vc/v1/user';
  const usr = {
    accountId: LyraCrypto.GetAccountIdFromPrivateKey(privatekey),
  };
  const data = {
    user: usr,
    signature: LyraCrypto.Sign(JSON.stringify(usr), privatekey),
  };
  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
  try {
    const ret = await api.post('/register', data);
    console.log('register result: ', ret.data);
    if (ret.data.success) {
      return ret.data.data.token as string;
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

const createDefaultCompany = async (): Promise<Company> => {
  // create a default company, with 1 employee
  const wallet = LyraCrypto.GenerateWallet();
  console.log('wallet address: ', wallet.accountId);
  const defaultCompany: Company = {
    config: defaultConfig,
    settings: {tts: true, guide: true, autoSaveImage: false},
    privatekey: wallet.privateKey,
    name: 'Default Company',
    curid: 'A0001',
    jwt: await registerUser(new URL(defaultConfig.API_URL), wallet.privateKey),
    employees: [
      {
        id: 'A0001',
        name: '晓玲珑',
        desc: '晓玲珑是一名助理，她的工作是帮助公司的老板完成一些日常的工作。',
        avatar: `${defaultConfig.API_URL}/assets/avatar/A0001.png`,
      },
    ],
  };
  return defaultCompany;
};

const storeName = '@company';

interface AppContextProviderProps {
  children: React.ReactNode;
}
export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const storedCompanyData = await AsyncStorage.getItem(storeName);
        if (storedCompanyData) {
          const saved = JSON.parse(storedCompanyData);
          setCompany(saved);
          API_URL_DEFAULT = saved.config.API_URL;
        } else {
          setCompany(await createDefaultCompany());
        }
      } catch (error) {
        console.error('Error loading company data:', error);
        setCompany(await createDefaultCompany());
      }
    };

    loadCompanyData();
  }, []);

  useEffect(() => {
    async function saveData() {
      try {
        console.log('Company updated and saved: ', company);
        await AsyncStorage.setItem(storeName, JSON.stringify(company));
      } catch (error) {
        console.log(error);
      }
    }

    saveData();
  }, [company]);

  return (
    <AppContext.Provider value={{company, setCompany}}>
      {company ? children : <Text>Loading data...</Text>}
    </AppContext.Provider>
  );
};

export default AppContext;
