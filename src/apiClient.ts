import axios, {AxiosInstance} from 'axios';

const OPENAI_KEY = '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';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://ai.lyra.live/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_KEY}`,
  },
});

export default apiClient;
