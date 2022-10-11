import { PacketState } from "cosmjs-types/ibc/core/channel/v1/channel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { portIdChannelIdSeparator } from "../..";
import { useClient } from "../../../contexts/ClientContext";
import { pathAcknowledgements, pathChannels, pathConnections } from "../../paths";
import { style } from "../../style";

interface AcknowledgementsListProps {
  readonly connectionId: string;
  readonly portId: string;
  readonly channelId: string;
}

export function AcknowledgementsList({
  connectionId,
  portId,
  channelId,
}: AcknowledgementsListProps): JSX.Element {
  const paramConnection = `${pathConnections}/${connectionId}`;

  const { getClient } = useClient();
  const [acknowledgements, setAcknowledgements] = useState<PacketState[]>([]);

  useEffect(() => {
    (async function updatePacketAcknowledgementsResponse() {
      const packetAcknowledgementsResponse = await getClient().ibc.channel.allPacketAcknowledgements(
        portId,
        channelId,
      );
      const acks = packetAcknowledgementsResponse.acknowledgements;
      acks.sort((a, b) => {
        return a.sequence.comp(b.sequence);
      });
      setAcknowledgements(acks);
    })();
  }, [getClient, portId, channelId]);

  return acknowledgements.length ? (
    <div className="flex flex-col m-2 ml-0">
      <span className={style.subtitle}>Packet acknowledgements</span>
      <div className="flex flex-row flex-wrap">
        {acknowledgements.map((acknowledgement, index) => {
          const portIdChannelId = `${acknowledgement.portId}${portIdChannelIdSeparator}${acknowledgement.channelId}`;
          const paramChannel = `${pathChannels}/${portIdChannelId}`;
          const paramAcknowledgement = `${pathAcknowledgements}/${acknowledgement.sequence}`;

          return (
            <Link
              to={`${paramConnection}${paramChannel}${paramAcknowledgement}`}
              key={index}
              className={style.link}
            >
              <span>#{acknowledgement.sequence.toString(10)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  ) : (
    <div className={style.subtitle}>No acknowledgements found</div>
  );
}
