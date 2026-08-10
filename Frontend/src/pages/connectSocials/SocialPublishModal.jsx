import React, { useEffect, useMemo, useState } from "react";

import {
  X,
  Send,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";

import {
  getSocialAccounts,
  publishSocialPost,
  uploadSocialImage,
} from "../../services/socialApi";

import SocialPublishSelector from "./SocialPublishSelector";

export default function SocialPublishModal({
  isOpen,
  onClose,
  formData,
  organizationName,
  pamphletImageDataUrl,
  jobId,
}) {
  const [accounts, setAccounts] = useState([]);

  const [selectedAccountIds, setSelectedAccountIds] = useState([]);

  const [content, setContent] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [imageUrl, setImageUrl] = useState("");

  const [publishing, setPublishing] = useState(false);

  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const [scheduledFor, setScheduledFor] = useState("");

  const applyUrl = useMemo(() => {
    const frontend =
      import.meta.env.VITE_FRONTEND_URI || window.location.origin;

    return jobId ? `${frontend}/apply/${jobId}` : `${frontend}/advertisement`;
  }, [jobId]);

  const defaultPost = useMemo(() => {
    const title = formData?.jobTitle || "a new role";

    const org = organizationName || "our team";

    const department = formData?.department;

    const body = department
      ? `We're looking for a ${title} to join our ${department} team. Come help us build something great.`
      : `We're looking for a ${title} to join our team. Come help us build something great.`;

    return [
      `🚀 We're hiring! Join ${org} as a ${title}.`,
      "",
      body,
      "",
      `Apply here: ${applyUrl}`,
      "",
      "#Hiring #JobOpening #CareerOpportunity",
    ].join("\n");
  }, [formData, organizationName, applyUrl]);

  useEffect(() => {
    if (!isOpen) return;

    setContent(defaultPost);
    setSuccess(false);
    setError("");

    loadAccounts();
  }, [isOpen, defaultPost]);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);

      const result = await getSocialAccounts();

      const connected = result.accounts || [];

      setAccounts(connected);

      setSelectedAccountIds(connected.map((account) => account._id));
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Could not load social accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const convertDataUrlToFile = async (dataUrl) => {
    const response = await fetch(dataUrl);

    const blob = await response.blob();

    return new File([blob], "job-pamphlet.png", {
      type: "image/png",
    });
  };

  const uploadImageIfNecessary = async () => {
    if (imageUrl) {
      return imageUrl;
    }

    let file = imageFile;

    if (!file && pamphletImageDataUrl) {
      file = await convertDataUrlToFile(pamphletImageDataUrl);
    }

    if (!file) {
      return null;
    }

    const result = await uploadSocialImage(file);

    return result.media.url;
  };

  const handlePublish = async () => {
    try {
      setError("");

      if (!selectedAccountIds.length) {
        setError("Please select at least one social account.");

        return;
      }

      if (!content.trim()) {
        setError("Please enter your social media post.");

        return;
      }

      setPublishing(true);

      const uploadedImageUrl = await uploadImageIfNecessary();

      const result = await publishSocialPost({
        content,
        mediaUrl: uploadedImageUrl,
        accountIds: selectedAccountIds,
        scheduledFor: scheduleEnabled
          ? new Date(scheduledFor).toISOString()
          : undefined,
        timezone: "Asia/Karachi",
      });

      console.log("Zernio publish result:", result);

      setSuccess(true);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to publish post");
    } finally {
      setPublishing(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Publish Job Advertisement
            </h2>

            <p className="text-sm text-gray-500">
              Publish to multiple social platforms simultaneously.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />

              <h3 className="text-2xl font-bold text-slate-900 mt-5">
                Published Successfully
              </h3>

              <p className="text-gray-500 mt-2">
                Your job advertisement has been sent to the selected platforms.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-3 rounded-xl bg-primary-800 text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* ACCOUNTS */}

              <section>
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Select Platforms
                    </h3>

                    <p className="text-sm text-gray-500">
                      Choose where this job should be published.
                    </p>
                  </div>

                  {accounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAccountIds(
                          selectedAccountIds.length === accounts.length
                            ? []
                            : accounts.map((a) => a._id),
                        )
                      }
                      className="text-sm text-primary-800 font-medium"
                    >
                      {selectedAccountIds.length === accounts.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                </div>

                {loadingAccounts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <SocialPublishSelector
                    accounts={accounts}
                    selectedAccountIds={selectedAccountIds}
                    onChange={setSelectedAccountIds}
                  />
                )}
              </section>

              {/* IMAGE */}

              <section>
                <h3 className="font-bold text-slate-900 mb-3">
                  Campaign Image
                </h3>

                <div className="border border-gray-200 rounded-xl p-4">
                  {pamphletImageDataUrl ? (
                    <img
                      src={pamphletImageDataUrl}
                      alt="Job pamphlet"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      No campaign image selected
                    </div>
                  )}
                </div>
              </section>

              {/* CONTENT */}

              <section>
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-slate-900">
                    Social Media Copy
                  </h3>

                  <span className="text-xs text-gray-500">
                    {content.length} characters
                  </span>
                </div>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={8}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                />
              </section>

              {/* SCHEDULE */}

              <section>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={scheduleEnabled}
                    onChange={(event) =>
                      setScheduleEnabled(event.target.checked)
                    }
                  />

                  <span className="text-sm font-medium">
                    Schedule instead of publishing now
                  </span>
                </label>

                {scheduleEnabled && (
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(event) => setScheduledFor(event.target.value)}
                    className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                )}
              </section>

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="button"
                disabled={
                  publishing ||
                  !selectedAccountIds.length ||
                  (scheduleEnabled && !scheduledFor)
                }
                onClick={handlePublish}
                className="w-full py-3.5 rounded-xl bg-primary-800 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {scheduleEnabled ? "Schedule Post" : "Publish Now"}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
