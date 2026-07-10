export type Execution = {
  id: string;
  prompt: string;
  response: string;
  model: string;
  latency_ms: number;
  status: string;
  created_at: string;
};
