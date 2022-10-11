import { PacketState } from "cosmjs-types/ibc/core/channel/v1/channel";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { portIdChannelIdSeparator } from "../..";
import { useClient } from "../../../contexts/ClientContext";
import { pathChannels, pathCommitments, pathConnections } from "../../paths";
import { style } from "../../style";

interface CommitmentsListProps {
  readonly connectionId: string;
  readonly portId: string;
  readonly channelId: string;
}

export function CommitmentsList({ connectionId, portId, channelId }: CommitmentsListProps): JSX.Element {
  const paramConnection = `${pathConnections}/${connectionId}`;

  const { getClient } = useClient();
  const [commitments, setCommitments] = useState<"loading" | readonly PacketState[]>("loading");

  useEffect(() => {
    (async function updatePacketCommitmentsResponse() {
      const packetCommitmentsResponse = await getClient().ibc.channel.allPacketCommitments(portId, channelId);
      const comms = packetCommitmentsResponse.commitments;
      comms.sort((a, b) => a.sequence.comp(b.sequence));
      setCommitments(comms);
    })();
  }, [getClient, portId, channelId]);

  return (
    <>
      <span className={style.subtitle}>Packet commitments</span>
      {commitments === "loading" ? (
        <div>Loading commitments …</div>
      ) : commitments.length === 0 ? (
        <div>No commitments found</div>
      ) : (
        <div className="flex flex-col m-2 ml-0">
          <div className="flex flex-row flex-wrap">
            {commitments.map((commitment, index) => {
              const portIdChannelId = `${commitment.portId}${portIdChannelIdSeparator}${commitment.channelId}`;
              const paramChannel = `${pathChannels}/${portIdChannelId}`;
              const paramCommitment = `${pathCommitments}/${commitment.sequence}`;

              return (
                <Link
                  to={`${paramConnection}${paramChannel}${paramCommitment}`}
                  key={index}
                  className={style.link}
                >
                  <span>#{commitment.sequence.toString(10)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
