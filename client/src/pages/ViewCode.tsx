import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../api/ApiClient.ts";
import Prism from "prismjs";
import "prismjs/components/prism-typescript.js";

const client = new ApiClient();

export default function ViewCode() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("What would you like to build?");
  const [code, setCode] = useState("");

  useEffect(() => {
    (async () => {
      const code = await client.getSampleCode();
      setCode(code);
    })();
  }, []);

  const callLlm = async () => {
    const responseJson = await client.generateCode(prompt);
    setCode(responseJson.code);
  };

  const deploy = async () => {
    // The omission of a project id here will create a new project
    const responseJson = await client.deployProject(code);
    navigate(
      `/edit/${responseJson.id}?url=${encodeURIComponent(responseJson.url!)}`,
    );
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className="editor">
      <textarea value={prompt} onChange={(e) => setPrompt(e.value)} />
      <button onClick={callLlm}>Generate code</button>

      <pre id="highlighting" aria-hidden="true">
        <code className="language-ts" id="highlighting-content">{code}</code>
      </pre>
      <button className="run" onClick={deploy}>Deploy code</button>
    </div>
  );
}
