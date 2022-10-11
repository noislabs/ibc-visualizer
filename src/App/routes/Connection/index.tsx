import React from "react";
import { useParams } from "react-router-dom";

import { Navigation } from "../../components/Navigation";
import { style } from "../../style";
import { ChannelsList } from "./ChannelsList";
import { ConnectionData } from "./ConnectionData";

interface ConnectionParams {
  readonly connectionId: string;
}

export function Connection(): JSX.Element {
  const { connectionId } = useParams<ConnectionParams>();

  return (
    <div className="container mx-auto flex flex-col">
      <Navigation />
      <div className={style.title}>{connectionId}</div>
      <ConnectionData connectionId={connectionId} />
      <ChannelsList connectionId={connectionId} />
    </div>
  );
}
