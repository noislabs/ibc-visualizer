import { Channel, IdentifiedChannel } from "cosmjs-types/ibc/core/channel/v1/channel";

import { IbcChannelState, IbcConnectionState, IbcOrder } from "../types/ibc";

export function printIbcConnectionState(state: IbcConnectionState): string {
  switch (state) {
    case IbcConnectionState.STATE_INIT:
      return "Initial";
    case IbcConnectionState.STATE_TRYOPEN:
      return "Trying to open";
    case IbcConnectionState.STATE_OPEN:
      return "Open";
    default:
      return "Unspecified";
  }
}

export function printIbcChannelState(state: IbcChannelState): string {
  switch (state) {
    case IbcChannelState.STATE_INIT:
      return "Initial";
    case IbcChannelState.STATE_TRYOPEN:
      return "Trying to open";
    case IbcChannelState.STATE_OPEN:
      return "Open";
    case IbcChannelState.STATE_CLOSED:
      return "Closed";
    default:
      return "Unspecified";
  }
}

export function printIbcOrder(order: IbcOrder): string {
  switch (order) {
    case IbcOrder.ORDER_UNORDERED:
      return "Unordered";
    case IbcOrder.ORDER_ORDERED:
      return "Ordered";
    default:
      return "Unspecified";
  }
}

export function printChannelName(channel: IdentifiedChannel): string {
  return printChannelName2(channel.channelId, channel);
}

export function printChannelName2(channelId: string, channel: Channel): string {
  return `${channelId} ⧟ ${channel.counterparty?.channelId ?? "–"}`;
}
