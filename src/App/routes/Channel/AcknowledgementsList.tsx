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

  const { getIbcClient } = useClient();
  const [acknowledgements, setAcknowledgements] = useState<"loading" | readonly PacketState[]>("loading");

  useEffect(() => {
    (async function updatePacketAcknowledgementsResponse() {
      const packetAcknowledgementsResponse = await getIbcClient().ibc.channel.allPacketAcknowledgements(
        portId,
        channelId,
      );
      const acks = packetAcknowledgementsResponse.acknowledgements;
      acks.sort((a, b) => {
        return a.sequence.comp(b.sequence);
      });
      setAcknowledgements(acks);
    })();
  }, [getIbcClient, portId, channelId]);

  return (
    <>
      <span className={style.subtitle}>Packet acknowledgements</span>
      {acknowledgements === "loading" ? (
        <div>Loading acknowledgements …</div>
      ) : acknowledgements.length === 0 ? (
        <div>No acknowledgements found</div>
      ) : (
        <div className="flex flex-col m-2 ml-0">
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
      )}
    </>
  );
}
