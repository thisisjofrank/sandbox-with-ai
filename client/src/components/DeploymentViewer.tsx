import React from "react";

// This component is used to display the deployment URL along
// with an iframe to preview the deployed project.

export type Props = { url: string; status: string; anyError?: string | null };
export default function DeploymentViewer(props: Props) {
  const { url, status, anyError } = props;

  const showPreview = url && status === "success";

  return (
    <div className="console">
      <div className="url">
        {showPreview ? <a href={url}>{url}</a> : "Deployment URL"}
      </div>
      {anyError && <p className="error">{anyError}</p>}
      {showPreview
        ? <iframe src={url} title="sandbox" className="sandbox" />
        : <p className="sandbox">{status}</p>}
    </div>
  );
}
