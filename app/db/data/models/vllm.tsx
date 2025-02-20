import { LLMModel } from "@/app/adapter/interface"

export const provider = {
  id: 'vllm',
  providerName: 'VLLM',
}

// VLLM 的模型列表将从服务器动态获取
export const modelList: LLMModel[] = [] 