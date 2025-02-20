import ChatGPTApi from '@/app/adapter/openai/api';
import { LLMModel } from '@/app/adapter/interface';
import { getLlmConfigByProvider } from '@/app/utils/llms';

export default class VLLMApi extends ChatGPTApi {
  private provider: string;

  constructor() {
    super('vllm');
    this.provider = 'vllm';
  }

  private async getConfig() {
    return getLlmConfigByProvider(this.provider);
  }

  private ensureFullUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://${url}`;
  }

  override async check(modelId: string, apikey: string, apiUrl: string): Promise<{ status: 'error' | 'success'; message?: string }> {
    try {
      const fullUrl = this.ensureFullUrl(apiUrl);
      if (!fullUrl) {
        return {
          status: 'error',
          message: 'Invalid endpoint URL'
        };
      }

      const response = await fetch(`${fullUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apikey}`,
        },
      });

      if (!response.ok) {
        return {
          status: 'error',
          message: `Failed to connect to VLLM server: ${response.statusText}`
        };
      }

      const data = await response.json();
      if (!data.data?.length) {
        return {
          status: 'error',
          message: 'No models available on VLLM server'
        };
      }

      if (!modelId) {
        return { status: 'success' };
      }

      const model = data.data.find((m: any) => m.id === modelId);
      if (!model) {
        return {
          status: 'error',
          message: `Model ${modelId} not found on VLLM server`
        };
      }

      return {
        status: 'success'
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to connect to VLLM server'
      };
    }
  }

  override async models(): Promise<LLMModel[]> {
    try {
      const config = await this.getConfig();
      if (!config.endpoint || !config.apikey) {
        return [];
      }

      const fullUrl = this.ensureFullUrl(config.endpoint);
      if (!fullUrl) {
        return [];
      }

      const response = await fetch(`${fullUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apikey}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data.map((model: any) => ({
        id: model.id,
        displayName: model.id,
        maxTokens: model.max_model_len,
        supportVision: false,
        selected: true,
        provider: {
          id: this.provider,
          providerName: 'VLLM'
        }
      }));
    } catch (error) {
      console.error('Failed to fetch VLLM models:', error);
      return [];
    }
  }
} 