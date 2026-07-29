import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import JobForm from "./JobForm";
import AIPamphletCard from "./AiPamphletCard";
import PublishTipsCard from "./PublishTipsCard";
import { jobFormBestPractices, publishRoutingTips } from "./createadvertisementdata";

/**
 * Job-details form + AI Assistant sidebar, shown at /advertisement/add
 * whenever the pamphlet screen isn't. Fully controlled — every value
 * and handler is a prop from pages/CreateAdvertisement.jsx, which is
 * the single owner of formData, pamphletSettings, and which of the
 * two screens is currently showing.
 */
export default function CreateAdvertisementOverview({
  formData,
  onFieldChange,
  onSkillsChange,
  isSubmitting,
  submitError,
  onPublish,
  isPamphletGenerated,
  onOpenPamphletEditor,
  pamphletSettings,
  backTo = "/advertisement",
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        className="inline-flex items-center gap-1.5 text-gray-700 text-sm font-medium hover:text-primary-800 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Job Postings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {submitError && (
            <div
              role="alert"
              className="px-4 py-3 rounded-lg bg-red-50 outline outline-1 outline-offset-[-1px] outline-red-200 text-red-700 text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <JobForm
            formData={formData}
            onFieldChange={onFieldChange}
            onSkillsChange={onSkillsChange}
            onSubmit={onPublish}
            onCancel={() => navigate(backTo)}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-6">
          <AIPamphletCard
            isGenerated={isPamphletGenerated}
            onGenerate={onOpenPamphletEditor}
            onEdit={onOpenPamphletEditor}
            formData={formData}
            pamphletSettings={pamphletSettings}
          />
          <PublishTipsCard {...jobFormBestPractices} />
          <PublishTipsCard {...publishRoutingTips} />
        </div>
      </div>
    </div>
  );
}