import { toHex } from "@cosmjs/encoding";
import { QueryChannelResponse } from "cosmjs-types/ibc/core/channel/v1/query";
import React from "react";

import { printIbcChannelState, printIbcOrder } from "../../../utils/ibc";
import { HeightData } from "../../components/HeightData";
import { style } from "../../style";

interface ChannelDataProps {
  readonly portId: string;
  readonly channelId: string;
  readonly channelResponse: QueryChannelResponse;
}

export function ChannelData({ portId, channelId, channelResponse }: ChannelDataProps): JSX.Element {
  const counterparty = channelResponse.channel?.counterparty;
  return channelResponse.channel ? (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Channel ID</td>
            <td>{channelId}</td>
          </tr>
          <tr>
            <td>Port ID</td>
            <td>{portId}</td>
          </tr>
          <tr>
            <td>Version</td>
            <td>{channelResponse.channel.version ?? "–"}</td>
          </tr>
          <tr>
            <td>Ordering</td>
            <td>
              {channelResponse.channel.ordering ? printIbcOrder(channelResponse.channel.ordering) : "–"}
            </td>
          </tr>
          <tr>
            <td>State</td>
            <td>
              {channelResponse.channel.state ? printIbcChannelState(channelResponse.channel.state) : "–"}
            </td>
          </tr>
          <tr>
            <td>Counterparty</td>
            <td>
              {counterparty && (
                <>
                  Port ID: {counterparty.portId}
                  <br />
                </>
              )}
              {counterparty && <>Channel ID: {counterparty.channelId}</>}
            </td>
          </tr>
          <tr>
            <td>Connection hops</td>
            <td>
              {channelResponse.channel.connectionHops
                ? channelResponse.channel.connectionHops.join(", ")
                : "–"}
            </td>
          </tr>
          <tr>
            <td>Height</td>
            <td>
              <HeightData height={channelResponse.proofHeight} />
            </td>
          </tr>
          <tr>
            <td>Proof</td>
            <td>{channelResponse.proof?.length ? toHex(channelResponse.proof) : "–"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div className={style.subtitle}>No channel found</div>
  );
}
