import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Unplug,
  Plus,
  ShieldCheck,
} from "lucide-react";

import {
  connectSocialPlatform,
  getSocialAccounts,
} from "../../services/socialApi";

const platforms = [
  {
    key: "linkedin",
    name: "LinkedIn",
    description: "Share job advertisements with your professional network.",
    initials: "in",
  },
  {
    key: "twitter",
    name: "X / Twitter",
    description: "Publish job opportunities directly to X.",
    initials: "𝕏",
  },
  {
    key: "instagram",
    name: "Instagram",
    description: "Share job advertisements as engaging visual posts.",
    initials: "◎",
  },
  {
    key: "facebook",
    name: "Facebook",
    description: "Reach your audience with job opportunities on Facebook.",
    initials: "f",
  },
];

export default function SocialAccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState("");

  // ============================================================
  // LOAD SOCIAL ACCOUNTS
  // ============================================================

  const loadAccounts = async () => {
    try {
      setLoading(true);

      const result = await getSocialAccounts();

      setAccounts(result.accounts || []);
    } catch (error) {
      console.error("Failed to load social accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // ============================================================
  // CONNECT SOCIAL PLATFORM
  // ============================================================

  const handleConnect = async (platform) => {
    try {
      setConnecting(platform);

      const result = await connectSocialPlatform(platform);

      if (result?.authUrl) {
        window.location.href = result.authUrl;
      } else {
        setConnecting("");
      }
    } catch (error) {
      console.error("Failed to connect social platform:", error);

      alert(
        error.response?.data?.message ||
          "Failed to connect account. Please try again.",
      );

      setConnecting("");
    }
  };

  // ============================================================
  // PLATFORM CARD
  // ============================================================

  const renderCard = (platform) => {
    const connectedAccounts = accounts.filter(
      (account) => account.platform === platform.key,
    );

    const connected = connectedAccounts.length > 0;
    const isConnecting = connecting === platform.key;

    return (
      <div
        key={platform.key}
        className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200"
      >
        <div className="p-6">
          {/* ==================================================
              PLATFORM HEADER
          ================================================== */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Platform Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-colors ${
                  connected
                    ? "bg-primary-800 text-white"
                    : "bg-primary-50 text-primary-800"
                }`}
              >
                {platform.initials}
              </div>

              {/* Platform Information */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {platform.name}
                  </h3>

                  {connected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Connected
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {platform.description}
                </p>
              </div>
            </div>

            {/* Connected Check */}
            {connected && (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            )}
          </div>

          {/* ==================================================
              CONNECTED ACCOUNT STATE
          ================================================== */}

          {connected ? (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Connected Accounts
              </p>

              {/* Connected Accounts List */}
              <div className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div
                    key={account._id}
                    className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3.5 hover:bg-primary-50/50 transition-colors"
                  >
                    {/* Account Information */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary-800">
                          {(account.displayName ||
                            account.username ||
                            platform.name)[0].toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {account.displayName ||
                            account.username ||
                            "Connected account"}
                        </p>

                        {account.username && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {account.username}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Profile Link */}
                    {account.profileUrl && (
                      <a
                        href={account.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-800 bg-white border border-primary-100 rounded-lg hover:bg-primary-800 hover:text-white transition-colors"
                      >
                        View
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Connect Another Account */}
              <button
                type="button"
                disabled={isConnecting}
                onClick={() => handleConnect(platform.key)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 border border-primary-200 text-primary-800 bg-primary-50/50 hover:bg-primary-800 hover:text-white rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Connect Another Account
                  </>
                )}
              </button>
            </div>
          ) : (
            /* ==================================================
               DISCONNECTED STATE
            ================================================== */

            <button
              type="button"
              disabled={isConnecting}
              onClick={() => handleConnect(platform.key)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary-800 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-primary-700 active:bg-primary-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Connect {platform.name}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-800 rounded-full animate-spin" />

          <p className="text-sm text-gray-500">Loading social accounts...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-6 md:px-8 md:py-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            {/* Title */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-800 flex items-center justify-center shadow-sm shrink-0">
                <Unplug className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Social Media Accounts
                </h1>

                <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Connect your organization's social accounts to publish job
                  advertisements across multiple platforms.
                </p>
              </div>
            </div>

            {/* Connected Accounts Count */}
            <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary-800" />
              </div>

              <div>
                <p className="text-xs text-gray-500">Connected accounts</p>

                <p className="text-sm font-bold text-slate-900">
                  {accounts.length}{" "}
                  {accounts.length === 1 ? "account" : "accounts"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-3.5 md:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-primary-800 shrink-0" />

            <span>
              Your social account credentials are securely handled through the
              platform's authorization process.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          PLATFORM COLUMNS

          IMPORTANT:
          We intentionally DON'T use grid here.

          LinkedIn and Instagram are in one column.
          Twitter and Facebook are in another column.

          Therefore, if LinkedIn becomes taller after connecting
          an account, Twitter will NOT stretch to LinkedIn's height.
      ======================================================== */}

      <div className="flex flex-col md:flex-row items-start gap-5">
        {/* ======================================================
            LEFT COLUMN
        ======================================================= */}

        <div className="w-full md:flex-1 space-y-5">
          {renderCard(platforms[0])}

          {renderCard(platforms[2])}
        </div>

        {/* ======================================================
            RIGHT COLUMN
        ======================================================= */}

        <div className="w-full md:flex-1 space-y-5">
          {renderCard(platforms[1])}

          {renderCard(platforms[3])}
        </div>
      </div>

      {/* ========================================================
          REFRESH BUTTON
      ======================================================== */}

      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={loadAccounts}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:text-primary-800 hover:border-primary-200 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Accounts
        </button>
      </div>
    </div>
  );
}
