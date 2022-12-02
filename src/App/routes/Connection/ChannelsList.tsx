import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { portIdChannelIdSeparator } from "../..";
import { useClient } from "../../../contexts/ClientContext";
import { IbcChannelsResponse, IbcConnectionChannelsResponse } from "../../../types/ibc";
import { printChannelName } from "../../../utils/ibc";
import { pathChannels, pathConnections } from "../../paths";
import { style } from "../../style";

interface ChannelsListProps {
  readonly connectionId: string;
}

export function ChannelsList({ connectionId }: ChannelsListProps): JSX.Element {
  const paramConnection = `${pathConnections}/${connectionId}`;

  const { getClient } = useClient();
  const [channelsResponse, setChannelsResponse] = useState<
    IbcChannelsResponse | IbcConnectionChannelsResponse
  >();

  useEffect(() => {
    (async function updateChannelsResponse() {
      const channelsResponse = await getClient().ibc.channel.connectionChannels(connectionId);
      setChannelsResponse(channelsResponse);
    })();
  }, [connectionId, getClient]);

  async function loadMoreChannels(): Promise<void> {
    if (!channelsResponse?.pagination?.nextKey?.length) return;

    const newChannelsResponse = await getClient().ibc.channel.connectionChannels(
      connectionId,
      channelsResponse.pagination.nextKey,
    );

    const oldChannels = channelsResponse.channels ?? [];
    const newChannels = newChannelsResponse.channels ?? [];

    setChannelsResponse({
      ...newChannelsResponse,
      channels: [...oldChannels, ...newChannels],
    });
  }

  return channelsResponse?.channels?.length ? (
    <div>
      <span className={style.subtitle}>Channels</span>
      <div className="flex flex-col flex-wrap">
        {channelsResponse.channels.map((channel, index) => {
          const portIdChannelId = `${channel.portId}${portIdChannelIdSeparator}${channel.channelId}`;
          const paramChannel = `${pathChannels}/${portIdChannelId}`;

          return (
            <Link to={`${paramConnection}${paramChannel}`} key={index} className={style.link}>
              {printChannelName(channel)}
            </Link>
          );
        })}
      </div>
      {channelsResponse.pagination?.nextKey?.length ? (
        <button onClick={loadMoreChannels} className={style.link}>
          Load more
        </button>
      ) : null}
    </div>
  ) : (
    <span className={style.title}>No channels found</span>
  );
}
