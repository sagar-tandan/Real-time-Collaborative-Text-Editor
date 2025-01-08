import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export default function Room({ docId, children }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_E3RIrL2lIJ963mcxLL97E7hLfNaZOYaNXu9CnUJjoUe-ujUFHZqmd3Wm5o_j3YNe"
      }
    >
      <RoomProvider id={docId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
