import { toHex } from "@cosmjs/encoding";
import React, { useEffect, useState } from "react";

import { useClient } from "../../../contexts/ClientContext";
import { IbcNextSequenceReceiveResponse } from "../../../types/ibc";

interface NextSequenceReceiveDataProps {
  readonly portId: string;
  readonly channelId: string;
}

export function NextSequenceReceiveData({ portId, channelId }: NextSequenceReceiveDataProps): JSX.Element {
  const { getClient } = useClient();
  const [nextSequenceReceiveResponse, setNextSequenceReceiveResponse] =
    useState<IbcNextSequenceReceiveResponse>();

  useEffect(() => {
    (async function updateNextSequenceReceiveResponse() {
      const nextSequenceReceiveResponse = await getClient().ibc.channel.nextSequenceReceive(
        portId,
        channelId,
      );
      setNextSequenceReceiveResponse(nextSequenceReceiveResponse);
    })();
  }, [getClient, portId, channelId]);

  return nextSequenceReceiveResponse ? (
    <div className="flex flex-col m-2 ml-0">
      <span>
        Next sequence receive proof:{" "}
        {nextSequenceReceiveResponse.proof?.length ? toHex(nextSequenceReceiveResponse.proof) : "–"}
      </span>
      <span>
        Next sequence receive:{" "}
        {nextSequenceReceiveResponse.nextSequenceReceive
          ? nextSequenceReceiveResponse.nextSequenceReceive.toString(10)
          : "–"}
      </span>
    </div>
  ) : (
    <div className="font-bold">No next sequence receive found</div>
  );
}
