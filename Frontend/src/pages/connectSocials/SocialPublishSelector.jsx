import React from "react";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const icons = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

export default function SocialPublishSelector({
  accounts = [],
  selectedAccountIds = [],
  onChange,
}) {
  const toggleAccount = (accountId) => {
    if (selectedAccountIds.includes(accountId)) {
      onChange(selectedAccountIds.filter((id) => id !== accountId));
    } else {
      onChange([...selectedAccountIds, accountId]);
    }
  };

  if (!accounts.length) {
    return (
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500">
        No social accounts are connected.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {accounts.map((account) => {
        const selected = selectedAccountIds.includes(account._id);

        const Icon = icons[account.platform] || FaFacebook;

        return (
          <button
            type="button"
            key={account._id}
            onClick={() => toggleAccount(account._id)}
            className={`text-left p-4 rounded-xl border transition ${
              selected
                ? "border-primary-800 bg-primary-50"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Platform Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selected
                    ? "bg-primary-800 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Account Information */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate">
                  {account.displayName || account.username || account.platform}
                </div>

                <div className="text-xs text-gray-500 capitalize">
                  {account.platform}
                </div>
              </div>

              {/* Selection */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                  selected
                    ? "bg-primary-800 border-primary-800 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selected && <FaCheck className="w-3 h-3" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
