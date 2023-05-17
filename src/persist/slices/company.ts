//export let API_URL_DEFAULT = 'https://mars.vcorp.ai';

import axios from 'axios';
import {LyraCrypto} from '../../crypto/lyra-crypto';
import {delay} from '../../utils/util';

// fuck various dotenv configs. let's just hardcode the default config here.
const defaultConfig = {
  // for local dev: remove app, set this to http://10.0.2.2:3001, run just once.
  // default set to 'https://mars.vcorp.ai'
  API_URL: 'https://mars.vcorp.ai',
  SECRET_KEY: '5f7b9b9b-3b5c-4b9c-9c9b-5f7b9b9b3b5c',
};

export interface Config {
  API_URL: string;
  SECRET_KEY: string;
}

export interface Settings {
  tts: boolean;
  guide?: boolean;
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
  jwt?: string;
  employees: Employee[];
}

export const registerUserToServer = async (
  apiUrl: string,
  privatekey: string,
) => {
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

export const initialCompanyState: Company = {
  config: defaultConfig,
  settings: {tts: true, guide: true, autoSaveImage: false},
  privatekey: LyraCrypto.GenerateWallet().privateKey,
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
