export interface Messages{
  
}

export interface Model{
  modelId: string;
  modelParams: ModelParams;
}

export interface ModelParams {
  reasoning: "high" | "medium" | "low" | "off";
  webSearch: boolean;
  webSearchParams: {
    numResults: number;
    searchQuery: string;
  };
  tools: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  }[];
}