// API response types

interface RunningSandbox {
  id: string;
  url: string;
  code: string;
  status: "success" | "deploying" | "error" | string;
}

interface SampleCode {
  code: string;
}
