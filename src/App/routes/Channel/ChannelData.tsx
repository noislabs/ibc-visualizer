import { toHex } from "@cosmjs/encoding";
import { QueryChannelResponse } from "cosmjs-types/ibc/core/channel/v1/query";
import React from "react";

import { printIbcChannelState, printIbcOrder } from "../../../utils/ibc";
import { CounterpartyData } from "../../components/ChannelCounterpartyData";
import { HeightData } from "../../components/HeightData";
import { style } from "../../style";

interface ChannelDataProps {
  readonly portId: string;
  readonly channelId: string;
  readonly channelResponse: QueryChannelResponse;
}

export function ChannelData({ portId, channelId, channelResponse }: ChannelDataProps): JSX.Element {
  return channelResponse.channel ? (
    <div>
      <strong>Data</strong>
      <div>Port ID: {portId}</div>
      <div>Channel ID: {channelId}</div>
      <div>Proof: {channelResponse.proof?.length ? toHex(channelResponse.proof) : "–"}</div>
      <HeightData height={channelResponse.proofHeight} />
      <div className="flex flex-col">
        <span>
          State: {channelResponse.channel.state ? printIbcChannelState(channelResponse.channel.state) : "–"}
        </span>
        <span>Version: {channelResponse.channel.version ?? "–"}</span>
        <span>
          Ordering: {channelResponse.channel.ordering ? printIbcOrder(channelResponse.channel.ordering) : "–"}
        </span>
        <CounterpartyData counterparty={channelResponse.channel.counterparty ?? null} />
        <span>
          Connection hops:{" "}
          {channelResponse.channel.connectionHops ? channelResponse.channel.connectionHops.join(", ") : "–"}
        </span>
      </div>
    </div>
  ) : (
    <div className={style.subtitle}>No channel found</div>
  );
}
