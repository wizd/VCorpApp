import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LyraCrypto} from '../crypto/lyra-crypto';
import axios from 'axios';
import checkTtsEngine from '../utils/checkTtsEngine';

// fuck various dotenv configs. let's just hardcode the default config here.
const defaultConfig = {
  // for local dev: remove app, set this to http://10.0.2.2:3001, run just once.
  // default set to 'https://smart.lyra.live'
  API_URL: 'https://smart.lyra.live',
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
    const defaultCompany: Company = {
      config: defaultConfig,
      settings: {tts: true, guide: true, autoSaveImage: false},
      privatekey: wallet.privateKey,
      name: 'Default Company',
      curid: 'A0001',
      jwt: '',
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

  useEffect(() => {
    const register = async (co: Company) => {
      setCompany(co);
      console.log('registering my company: ', co);
      const baseUrl = co.config.API_URL + '/vc/v1/user';
      const usr = {
        accountId: LyraCrypto.GetAccountIdFromPrivateKey(co.privatekey),
      };
      const data = {
        user: usr,
        signature: LyraCrypto.Sign(JSON.stringify(usr), co.privatekey),
      };
      const api = axios.create({
        baseURL: baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });
      const ret = await api.post('/register', data);
      console.log('register result: ', ret.data);
      if (ret.data.success) {
        const newc = {...co, jwt: ret.data.data.token};
        setCompany(newc);

        const exists = await checkTtsEngine();
        console.log('TTS engine: ', exists);
        const newc2 = {
          ...newc,
          settings: {
            ...newc.settings,
            tts: exists && (newc.settings.tts ?? true),
          },
        };
        setCompany(newc2);
      }
    };

    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem(storeName);
        if (value !== null) {
          var companyFromData = JSON.parse(value);
          if (companyFromData.config === undefined) {
            companyFromData.config = defaultConfig;
          }
          if (companyFromData.settings === undefined) {
            companyFromData.settings = {tts: true};
          }
          await register(companyFromData);
          console.log('@company loaded from storage: ', value);
        } else {
          const defaultCompany = createDefaultCompany();
          await register(defaultCompany);
        }
      } catch (error) {
        const defaultCompany = createDefaultCompany();
        await register(defaultCompany);
      }
    };

    // Use an immediately invoked async function to handle loadData and register
    (async () => {
      try {
        await loadData();
      } catch (error) {
        console.log('in await loadData', error);
      }
    })();
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
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
