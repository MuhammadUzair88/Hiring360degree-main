// utils/stream.js

import { StreamChat } from 'stream-chat';
import { StreamClient } from '@stream-io/node-sdk';
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("❌ Stream API Key and Secret must be set in environment variables");
    process.exit(1);
}

console.log("✅ Stream configured with API Key:", apiKey.substring(0, 8) + "...");

// Video client
export const streamClient = new StreamClient(apiKey, apiSecret);

// Chat client
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// Helper function to upsert users with roles
export const createStreamUser = async (userData) => {
    try {
        const enrichedUserData = {
            id: userData.id,
            name: userData.name,
            role: userData.role || 'user',
        };

        // 1. Update Stream Chat
        await chatClient.upsertUser(enrichedUserData);
        
        // 2. Update Stream Video (THIS FIXES THE 403!)
        if (streamClient.upsertUsers) {
             await streamClient.upsertUsers([enrichedUserData]);
        }

        console.log("✅ Stream User upserted for Chat & Video:", enrichedUserData.id);
        return enrichedUserData;
    } catch (error) {
        console.error("❌ Error upserting user to Stream:", error);
        throw error;
    }
};

// Helper function to delete users
export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.log("✅ Stream User deleted:", userId);
    } catch (error) {
        console.error("❌ Error deleting user from Stream:", error);
        throw error;
    }
};

// Helper function to create a video call with waiting room
export const createVideoCall = async (callId, hostId, hostName, participantId, participantName, customData = {}) => {
    try {
        console.log("📹 Creating video call:", callId);
        console.log("  Host:", hostId, hostName);
        console.log("  Participant:", participantId, participantName);
        
        const call = streamClient.video.call("default", callId);
        
        await call.getOrCreate({
            data: {
                created_by_id: hostId,
                created_by_display_name: hostName,
                members: [
                    {
                        user_id: hostId,
                        role: "host",
                        name: hostName,
                    },
                    {
                        user_id: participantId,
                        role: "user",
                        name: participantName,
                    },
                ],
                custom: {
                    ...customData,
                    hostName,
                    participantName,
                    createdAt: new Date().toISOString(),
                },
                settings_override: {
                    // Disable recording
                    recording: {
                        mode: "disabled",
                    },
                    // Ring settings
                    ring: {
                        auto_cancel_timeout_ms: 60000, // 1 minute
                        incoming_call_timeout_ms: 60000,
                    },
                    // Backstage/Waiting Room - THIS IS THE KEY SETTING
                    backstage: {
                        enabled: false,
                        auto_approve: true, // Host must manually approve
                    },
                    // Join permissions
                    joins: {
                        camera: "on",
                        microphone: "on",
                    },
                },
            },
        });
        
        console.log("✅ Video call created successfully");
        return call;
    } catch (error) {
        console.error("❌ Error creating video call:", error);
        throw error;
    }
};

// Helper function to grant permissions to a user (admit from waiting room)
export const admitParticipant = async (callId, userId, permissions = []) => {
    try {
        const call = streamClient.video.call("default", callId);
        
        const defaultPermissions = [
            "send-audio",
            "send-video",
            "join-call",
        ];
        
        await call.grantPermissions(userId, [...defaultPermissions, ...permissions]);
        console.log("✅ Admitted participant:", userId);
        return true;
    } catch (error) {
        console.error("❌ Error admitting participant:", error);
        throw error;
    }
};

// Helper function to remove a participant
export const removeParticipant = async (callId, userId) => {
    try {
        const call = streamClient.video.call("default", callId);
        await call.removeMember(userId);
        console.log("✅ Removed participant:", userId);
        return true;
    } catch (error) {
        console.error("❌ Error removing participant:", error);
        throw error;
    }
};


// Helper function to end a call
export const endCall = async (callId) => {
    try {
        const call = streamClient.video.call("default", callId);
        await call.end();
        console.log("✅ Call ended:", callId);
        return true;
    } catch (error) {
        console.error("❌ Error ending call:", error);
        throw error;
    }
};

// Helper to get call details
export const getCallDetails = async (callId) => {
    try {
        const call = streamClient.video.call("default", callId);
        const details = await call.get();
        return details;
    } catch (error) {
        console.error("❌ Error getting call details:", error);
        throw error;
    }
};

// =========================
// MUTE PARTICIPANT (PUBLIC)
// =========================
export const muteCandidateInCall = async (req, res) => {
  try {
    const { callId, userId } = req.params;
    await muteParticipant(callId, userId, "audio");
    res.status(200).json({ success: true, message: "Participant muted" });
  } catch (error) {
    console.error("❌ Mute participant error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to mute a participant
export const muteParticipant = async (callId, userId, type = "audio") => {
    try {
        const call = streamClient.video.call("default", callId);
        await call.muteUser(userId, type);
        console.log("✅ Muted participant:", userId, type);
        return true;
    } catch (error) {
        console.error("❌ Error muting participant:", error);
        throw error;
    }
};
