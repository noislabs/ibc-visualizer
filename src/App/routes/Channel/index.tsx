import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { portIdChannelIdSeparator } from "../..";
import { useClient } from "../../../contexts/ClientContext";
import { IbcChannelResponse } from "../../../types/ibc";
import { printChannelName2 } from "../../../utils/ibc";
import { Navigation } from "../../components/Navigation";
import { style } from "../../style";
import { AcknowledgementsList } from "./AcknowledgementsList";
import { ChannelData } from "./ChannelData";
import { CommitmentsList } from "./CommitmentsList";
import { NextSequenceReceiveData } from "./NextSequenceReceiveData";
import { SequenceForm } from "./SequenceForm";
import { UnreceivedAcksList } from "./UnreceivedAcksList";
import { UnreceivedPacketsList } from "./UnreceivedPacketsList";

interface ChannelParams {
  readonly connectionId: string;
  readonly portIdChannelId: string;
}

export function Channel(): JSX.Element {
  const { connectionId, portIdChannelId } = useParams<ChannelParams>();
  const [portId, channelId] = portIdChannelId.split(portIdChannelIdSeparator);
  const { getIbcClient } = useClient();

  const [searchSequence, setSearchSequence] = useState<number>();
  const [channelResponse, setChannelResponse] = useState<IbcChannelResponse>();

  useEffect(() => {
    (async function updateChannelResponse() {
      const channelResponse = await getIbcClient().ibc.channel.channel(portId, channelId);
      setChannelResponse(channelResponse);
    })();
  }, [getIbcClient, portId, channelId]);

  return (
    <div className="container mx-auto">
      <Navigation />
      <span className={style.title}>
        {channelResponse && channelResponse.channel && printChannelName2(channelId, channelResponse.channel)}
      </span>
      {channelResponse && (
        <ChannelData portId={portId} channelId={channelId} channelResponse={channelResponse} />
      )}
      <NextSequenceReceiveData portId={portId} channelId={channelId} />
      <CommitmentsList connectionId={connectionId} portId={portId} channelId={channelId} />
      <AcknowledgementsList connectionId={connectionId} portId={portId} channelId={channelId} />
      <SequenceForm sequence={searchSequence} setSequence={setSearchSequence} />
      {searchSequence !== undefined ? (
        <>
          <UnreceivedPacketsList portId={portId} channelId={channelId} sequence={searchSequence} />
          <UnreceivedAcksList portId={portId} channelId={channelId} sequence={searchSequence} />
        </>
      ) : null}
    </div>
  );
}
