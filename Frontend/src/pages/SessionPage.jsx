import React from "react";
import { SessionOverview } from "../components/organization/sessionPage";

/**
 * SessionPage
 * ---------------------------------------------------------------------------
 * Route-level component for `/interview/:callId`.
 *
 * The session experience currently runs entirely on the dummy data in
 * `components/organization/sessionPage/data.js` - no backend or Stream
 * Video connection is wired in yet, by design, while the UI is being built
 * out. <SessionOverview /> already accepts real `userData`, `sessionInfo`,
 * and participant/chat data as props, so once the API and Stream call setup
 * are ready, this is the right place to:
 *
 *   1. Read `callId` via `useParams()`
 *   2. Fetch call details + a Stream token from the backend
 *   3. Open the Stream Video connection (StreamVideo / StreamCall)
 *   4. Pass the live data down to <SessionOverview /> in place of its
 *      dummy-data defaults
 *
 * Nothing in the components folder needs to change to support that - every
 * child component already works off plain props.
 * ---------------------------------------------------------------------------
 */
export default function SessionPage() {
  return <SessionOverview />;
}