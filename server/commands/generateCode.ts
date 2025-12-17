import { RouterContext } from "jsr:@oak/oak/router";
import handleErrors from "./shared/handleErrors.ts";

export default async function (
  ctx: RouterContext<string, Record<string, string>>,
) {
  await handleErrors(ctx, async () => {
    
    const code = `
console.log("Server starting up...");

Deno.serve(() => {
  return new Response("Hello, World, from generated code!");
});`.trimStart();

    const prompt = `
You are a code generator that generates both the server side code, and web UI code for demo applications.
You're going to be embedded in a demo application, that shows we can host the code you generate.
You write TypeScript code, targeting the Deno runtime. All modern JavaScript and TypeScript features are supported.

You should generate the code in a single file, to satisfy the prompt the best you can.
Write the server side code using the Hono framework (https://hono.dev/), and the web UI code using react (https://react.dev/).

An example of a Hono + Deno app looks like this:

import { Hono } from 'jsr:@hono/hono'
const app = new Hono();
app.get('/', (c) => c.text('Hello Deno!'))
Deno.serve(app.fetch)"

Use the Hono documentation to help support JSX, HTML, static assets, CSS and routing.

Please write a single file application to fullfil the following prompt, returning only the code file, and nothing else:
    `;

    const postBody = await ctx?.request?.body.json();
    const userPrompt = postBody?.prompt;
    const llmRequest = prompt + userPrompt;

    const gptOutputText = ""; // await callYourLLMAPIHere(llmRequest);

    ctx.response.status = 201;
    ctx.response.body = JSON.stringify({
      code
    });
  });
}
