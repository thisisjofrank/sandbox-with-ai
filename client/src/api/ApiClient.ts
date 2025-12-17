import doUntil from "./doUntil.ts";

export default class ApiClient {
  constructor(private readonly baseUrl: string = "") { }

  public async getSampleCode(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/sample`);
    return (await response.json()).code;
  }

  public async generateCode(prompt: string): Promise<{ code: string }> {
    const response = await fetch(`${this.baseUrl}/api/generate`, { method: "POST", body: JSON.stringify({ prompt }) });

    if (!response.ok) {
      throw new Error("Failed to generate code");
    }

    return await response.json();
  }

  public async getProject(id: string): Promise<RunningSandbox> {
    const response = await fetch(`${this.baseUrl}/api/project/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }
    return await response.json();
  }

  public async deployProject(
    code: string,
    id?: string,
  ): Promise<RunningSandbox> {
    const idSuffix = id ? `/${id}` : "";

    const response = await fetch(`${this.baseUrl}/api/project${idSuffix}`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error("Failed to deploy project." + (errorBody.message ? ` ${errorBody.message}` : "") + (errorBody.stack ? ` stack: ${errorBody.stack}` : ""));
    }

    return await response.json();
  }
}
