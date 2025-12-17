import { RouterContext } from "jsr:@oak/oak/router";
import handleErrors from "./shared/handleErrors.ts";
import { DenoSandboxesClient } from "../deno-api/DenoSandboxesClient.ts";

export default async function (
  ctx: RouterContext<string, Record<string, string>>,
) {
  await handleErrors(ctx, async () => {
    const client = new DenoSandboxesClient();
    const id = ctx?.params?.id;

    if (!id) {
      throw new Error("No sandbox ID provided");
    }

    const runningSandbox = await client.getSandboxContent(id, "main.ts");

    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(runningSandbox);
  });
}
