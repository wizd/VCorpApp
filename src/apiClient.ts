import axios, {AxiosInstance} from 'axios';

const OPENAI_KEY = 'sk-...';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_KEY}`,
  },
});

export default apiClient;
