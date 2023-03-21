import apiClient from './apiClient';

interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    text: string;
    index: number;
    logprobs: null;
    finish_reason: string;
  }[];
}

export const generateResponse = async (
  inputMessage: string,
): Promise<string> => {
  try {
    const payload = {
      model: 'text-davinci-002', // 或者其他 GPT-4 模型
      prompt: inputMessage,
      max_tokens: 50,
    };

    const response = await apiClient.post<CompletionResponse>(
      '/engines/davinci-codex/completions',
      payload,
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error(error);
    return 'Error generating response';
  }
};
