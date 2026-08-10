import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "STREAM_API_KEY and STREAM_API_SECRET must be configured on the backend"
  );
}

export const streamClient = new StreamClient(apiKey, apiSecret);
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const createStreamUser = async ({ id, name, role = "user", image }) => {
  if (!id) throw new Error("Stream user id is required");

  const user = {
    id: String(id),
    name: name || "Participant",
    role,
    ...(image ? { image } : {}),
  };

  await Promise.all([
    chatClient.upsertUser(user),
    streamClient.upsertUsers([user]),
  ]);

  return user;
};

export const createVideoCall = async (
  callId,
  hostId,
  hostName,
  participantId,
  participantName,
  customData = {}
) => {
  if (!callId || !hostId || !participantId) {
    throw new Error("callId, hostId and participantId are required");
  }

  const call = streamClient.video.call("default", callId);

  await call.getOrCreate({
    data: {
      created_by_id: hostId,
      members: [
        // Keep both Stream users global role=user. Host authority is scoped to
        // this call only via the call member role.
        { user_id: hostId, role: "host" },
        { user_id: participantId },
      ],
      custom: {
        ...customData,
        hostName: hostName || "Interviewer",
        participantName: participantName || "Candidate",
      },
    },
  });

  return call;
};

export const ensureInterviewChatChannel = async ({
  callId,
  hostId,
  participantId,
  roundName,
}) => {
  const channel = chatClient.channel("messaging", callId, {
    name: `${roundName || "Interview"} Chat`,
    created_by_id: hostId,
    members: [hostId, participantId],
  });

  // query() creates the channel if it does not exist and returns its state if
  // it already exists. Repair membership only when a legacy channel is missing
  // one of the scheduled interview participants.
  await channel.query();

  const existingMemberIds = new Set(
    Object.keys(channel.state?.members || {})
  );
  const missingMembers = [hostId, participantId].filter(
    (userId) => !existingMemberIds.has(userId)
  );

  if (missingMembers.length > 0) {
    await channel.addMembers(missingMembers);
  }

  return channel;
};

export const admitParticipant = async (callId, userId, permissions = []) => {
  const call = streamClient.video.call("default", callId);
  const defaults = ["send-audio", "send-video", "join-call"];
  await call.grantPermissions(userId, [...new Set([...defaults, ...permissions])]);
};

export const removeParticipant = async (callId, userId) => {
  const call = streamClient.video.call("default", callId);
  await call.kickUser({ user_id: userId });
};

export const endCall = async (callId) => {
  const call = streamClient.video.call("default", callId);
  await call.end();
};

export const muteParticipant = async (callId, userId, type = "audio") => {
  const call = streamClient.video.call("default", callId);
  await call.muteUser(userId, type);
};

export const muteCandidateInCall = async (req, res) => {
  try {
    const { callId, userId } = req.params;
    await muteParticipant(callId, userId, "audio");
    return res.status(200).json({ success: true, message: "Participant muted" });
  } catch (error) {
    console.error("Mute participant error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
