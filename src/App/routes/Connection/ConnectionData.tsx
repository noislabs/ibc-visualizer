import { toHex } from "@cosmjs/encoding";
import React, { useEffect, useState } from "react";

import { useClient } from "../../../contexts/ClientContext";
import { IbcConnectionResponse } from "../../../types/ibc";
import { printIbcConnectionState } from "../../../utils/ibc";
import { HeightData } from "../../components/HeightData";
import { style } from "../../style";

interface ConnectionDataProps {
  readonly connectionId: string;
}

export function ConnectionData({ connectionId }: ConnectionDataProps): JSX.Element {
  const { getClient } = useClient();
  const [connectionResponse, setConnectionResponse] = useState<IbcConnectionResponse>();

  useEffect(() => {
    (async function updateConnectionResponse() {
      const connectionResponse = await getClient().ibc.connection.connection(connectionId);
      setConnectionResponse(connectionResponse);
    })();
  }, [getClient, connectionId]);

  const counterparty = connectionResponse?.connection?.counterparty;
  return connectionResponse?.connection ? (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Connection ID</td>
            <td>{connectionId}</td>
          </tr>
          <tr>
            <td>Client ID</td>
            <td>{connectionResponse.connection.clientId ?? "–"}</td>
          </tr>
          <tr>
            <td>State</td>
            <td>
              {connectionResponse.connection.state
                ? printIbcConnectionState(connectionResponse.connection.state)
                : "–"}
            </td>
          </tr>
          <tr>
            <td>Delay period</td>
            <td>{connectionResponse.connection.delayPeriod.toString()}ns</td>
          </tr>
          <tr>
            <td>Counterparty</td>
            <td>
              {counterparty && (
                <div className="flex flex-col m-2 ml-0">
                  <span>Client ID: {counterparty.clientId}</span>
                  <span>Connection ID: {counterparty.connectionId}</span>
                  <span>
                    Prefix: {counterparty.prefix?.keyPrefix ? toHex(counterparty.prefix?.keyPrefix) : "–"}
                  </span>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td>Proof</td>
            <td>{connectionResponse.proof?.length ? toHex(connectionResponse.proof) : "–"}</td>
          </tr>
        </tbody>
      </table>
      <HeightData height={connectionResponse.proofHeight} />
      <div className="flex flex-col">
        {connectionResponse.connection.versions?.length ? (
          <div>
            <span className={style.subtitle}>Versions</span>
            {connectionResponse.connection.versions.map((version, index) => (
              <div key={index} className="flex flex-col">
                <span>ID: {version.identifier ?? "–"}</span>
                <span>Features: {version.features ? version.features.join(", ") : "–"}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className={style.subtitle}>No versions found</span>
        )}
      </div>
    </div>
  ) : (
    <span className={style.subtitle}>No connection found</span>
  );
}
