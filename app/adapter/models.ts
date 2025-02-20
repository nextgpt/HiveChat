import ChatGPTApi from '@/app/adapter/openai/api';
import Claude from '@/app/adapter/claude/api';
import GeminiApi from '@/app/adapter/gemini/api';
import VLLMApi from '@/app/adapter/vllm/api';

export const getLLMInstance = (providerId: string) => {
  let llmApi;
  switch (providerId) {
    case 'claude':
      llmApi = new Claude();
      break;
    case 'gemini':
      llmApi = new GeminiApi();
      break;
    case 'vllm':
      llmApi = new VLLMApi();
      break;
    default:
      llmApi = new ChatGPTApi(providerId);
      break;
  }
  return llmApi;
}