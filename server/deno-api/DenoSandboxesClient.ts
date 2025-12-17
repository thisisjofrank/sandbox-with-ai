import { Sandbox } from "@deno/sandbox";

export class DenoSandboxesClient {
  public async createSandbox() {
    const sandbox = await Sandbox.create({ lifetime: "5m" });
    const id = sandbox.id;
    const url = await sandbox.exposeHttp({ port: 8000 });
    await sandbox.writeTextFile("url.txt", url);
    await sandbox.close(); // process can exit now
    return { id, url, code: "", status: "success" };
  }

  public async getSandboxContent(id: string, path: string) {
    const sandbox = await Sandbox.connect({ id });
    const url = await sandbox.readTextFile("url.txt");
    const code = await sandbox.readTextFile(path);
    await sandbox.close();
    return { id, url, code, status: "success" };
  }

  public async deploy(id: string, files: Map<string, string>, isAnUpdate: boolean = false) {
    const sandbox = await Sandbox.connect({ id });
    const url = await sandbox.readTextFile("url.txt");

    for (const [name, content] of files) {
      await sandbox.writeTextFile(name, content);
    }

    if (isAnUpdate) {
      // Kill js runtime to refresh files because there is no hot-reload
      // There must be a better way to do this
      try{ 
        await sandbox.sh`pkill -f "deno run -A main.ts"`;
      } catch {
        console.log("No existing process to kill");
      }
    }

    const runtime = await sandbox.createJsRuntime({ entrypoint: "main.ts" });
    const isReady = await runtime.httpReady;
    
    await sandbox.close(); // process can exit now

    if (!isReady) {
      throw new Error("Failed to start HTTP server in sandbox");
    }

    return {
      id: id,
      url: url,
      code: files.get("main.ts") || "",
      status: "success",
    } as RunningSandbox;
  }

}
