"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "react-router-dom";

export default function Room({ children }) {
  const docId = useParams();
  console.log(docId?.id);
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_E3RIrL2lIJ963mcxLL97E7hLfNaZOYaNXu9CnUJjoUe-ujUFHZqmd3Wm5o_j3YNe"
      }
    >
      <RoomProvider id={docId?.id.toString()}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
