import React, { useEffect, useState } from "react";
import { Save, ArrowLeft, CalendarDays, RefreshCw, Sparkles, Users, CheckSquare, Square, Plus, Trash2, ListPlus, Loader2 } from "lucide-react";
import A4Preview from "./A4Preview";
import { calculateEndingDate, requiresEndingDate } from "./offerDateUtils";
import { buildDefaultOfferContent, classifyEmploymentType, JOB_KIND_LABELS } from "./OfferLetterContent";

function generateLocalFieldId() {
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function buildCompanyContext({ organization, advertisement, candidate, joiningDate, endingDate }) {
  return {
    name: organization?.name || "Your Company",
    department: advertisement?.department || "—",
    employmentType: advertisement?.employmentType || "—",
    internshipPaid: advertisement?.internshipPaid || "",
    workMode: advertisement?.workMode || "—",
    workLocation: advertisement?.location || organization?.location || "—",
    salary: advertisement?.salary || "Competitive compensation",
    position: advertisement?.jobTitle || candidate?.position || "Job Title",
    joiningDate: joiningDate || "your start date",
    endingDate: endingDate || "",
  };
}

/**
 * Full-page offer letter content editor — dates, paragraphs, dynamic
 * fields, and bulk-apply, with a live A4 preview alongside. Used by
 * both the "Generate Offer" and "Edit" flows (isEditing only changes
 * the header copy) and rendered directly by the standalone
 * EditOfferLetter page.
 */
export default function OfferLetterContentEditor({
  candidate,
  organization,
  advertisement,
  design,
  signature,
  offerValidityDays,
  initialJoiningDate = "",
  initialEndingDate = "",
  initialOfferContent = null,
  isEditing = false,
  otherCandidates = [],
  onSave,
  onCancel,
}) {
  const showEndingDate = requiresEndingDate(advertisement?.employmentType);
  const kind = classifyEmploymentType(advertisement?.employmentType, advertisement?.internshipPaid);
  const isInternship = kind === "paid-internship" || kind === "unpaid-internship";

  const [joiningDate, setJoiningDate] = useState(initialJoiningDate);
  const [endingDate, setEndingDate] = useState(initialEndingDate);
  const [endingTouched, setEndingTouched] = useState(Boolean(initialEndingDate));

  const [paragraph1, setParagraph1] = useState(initialOfferContent?.paragraph1 || "");
  const [paragraph2, setParagraph2] = useState(initialOfferContent?.paragraph2 || "");
  const [paragraph3, setParagraph3] = useState(initialOfferContent?.paragraph3 || "");
  const [fieldsSectionLabel, setFieldsSectionLabel] = useState(initialOfferContent?.fieldsSectionLabel || "");
  const [additionalFields, setAdditionalFields] = useState(Array.isArray(initialOfferContent?.additionalFields) ? initialOfferContent.additionalFields : []);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const computeDefaults = (jd, ed) => {
    const company = buildCompanyContext({ organization, advertisement, candidate, joiningDate: jd, endingDate: ed });
    return buildDefaultOfferContent({ candidate, company });
  };

  // Seed defaults on first render if there's no existing content.
  useEffect(() => {
    if (!initialOfferContent) {
      const d = computeDefaults(initialJoiningDate, initialEndingDate);
      setParagraph1(d.paragraph1);
      setParagraph2(d.paragraph2);
      setParagraph3(d.paragraph3);
      setFieldsSectionLabel(d.fieldsSectionLabel);
      setAdditionalFields(d.additionalFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calculate ending date for contract/internship roles.
  useEffect(() => {
    if (!showEndingDate || endingTouched) return;
    setEndingDate(calculateEndingDate(joiningDate, advertisement));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joiningDate, showEndingDate]);

  const handleAutoCalculateEnding = () => {
    setEndingTouched(false);
    setEndingDate(calculateEndingDate(joiningDate, advertisement));
  };

  const handleRegenerateText = () => {
    const d = computeDefaults(joiningDate, showEndingDate ? endingDate : "");
    setParagraph1(d.paragraph1);
    setParagraph2(d.paragraph2);
    setParagraph3(d.paragraph3);
    setFieldsSectionLabel(d.fieldsSectionLabel);
    setAdditionalFields(d.additionalFields);
  };

  const addField = () => setAdditionalFields((prev) => [...prev, { id: generateLocalFieldId(), label: "", value: "" }]);
  const updateField = (id, patch) => setAdditionalFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const removeField = (id) => setAdditionalFields((prev) => prev.filter((f) => f.id !== id));
  const toggleSelected = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const isValid = Boolean(joiningDate) && (!showEndingDate || Boolean(endingDate)) && Boolean(paragraph1.trim()) && Boolean(paragraph2.trim()) && Boolean(paragraph3.trim());
  const cleanedFields = additionalFields.filter((f) => f.label.trim() || f.value.trim());

  const liveFormData = { joiningDate, endingDate: showEndingDate ? endingDate : "" };
  const liveCustomContent = { paragraph1, paragraph2, paragraph3, fieldsSectionLabel: fieldsSectionLabel || undefined, additionalFields: cleanedFields };

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    try {
      await onSave(candidate.applicationId, { joiningDate, endingDate: showEndingDate ? endingDate : "", offerContent: liveCustomContent }, bulkOpen ? selectedIds : []);
    } finally {
      setIsSaving(false);
    }
  };

  const totalRecipients = 1 + (bulkOpen ? selectedIds.length : 0);
  const fieldsHeadingPlaceholder = isInternship ? "Internship Benefits & Certificate" : kind === "contract" ? "Contract Terms & Benefits" : "Compensation & Benefits";

  const candidateDisplayName = candidate?.name || "Candidate";
  const candidateDisplayEmail = candidate?.email || "candidate@email.com";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="p-2 bg-secondary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 hover:bg-secondary-100 text-gray-700 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-slate-900 text-xl sm:text-2xl font-semibold leading-tight">{isEditing ? "Edit Offer Letter" : "Generate Offer Letter"}</h1>
            <p className="text-gray-700 text-sm">
              {candidateDisplayName} · <span className="font-medium">{JOB_KIND_LABELS[kind] || "General"}</span> role
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className="px-5 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving…" : totalRecipients > 1 ? `Save & Apply to ${totalRecipients} Candidates` : "Save Offer Letter"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-1 xl:order-2 flex flex-col gap-6">
          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-2 text-xs">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">Active Subject</span>
            <p className="text-primary-800 font-semibold text-sm">{candidateDisplayName}</p>
            <p className="text-gray-500">{candidateDisplayEmail}</p>
            <p className="text-gray-700">
              {advertisement?.jobTitle || "Position"} · {JOB_KIND_LABELS[kind] || "General"}
            </p>
            {advertisement?.department && <p className="text-gray-500">{advertisement.department}</p>}
          </div>

          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-4">
            <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Offer Dates
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 text-xs font-semibold">
                Joining Date <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="px-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              />
            </div>

            {showEndingDate ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-gray-500 text-xs font-semibold">
                    Ending Date <span className="text-red-700">*</span>
                  </label>
                  <button type="button" onClick={handleAutoCalculateEnding} disabled={!joiningDate} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-800 hover:text-primary-700 disabled:opacity-40 transition-colors">
                    <RefreshCw className="w-3 h-3" /> Auto Calculate
                  </button>
                </div>
                <input
                  type="date"
                  value={endingDate}
                  onChange={(e) => {
                    setEndingTouched(true);
                    setEndingDate(e.target.value);
                  }}
                  min={joiningDate || undefined}
                  className="px-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                />
                {advertisement?.internshipDuration && <p className="text-gray-500 text-xs">Duration from posting: {advertisement.internshipDuration}</p>}
              </div>
            ) : (
              <p className="text-gray-500 text-xs bg-secondary-100 rounded-lg px-3 py-2.5 outline outline-1 outline-offset-[-1px] outline-secondary-300">
                This role is {advertisement?.employmentType || "a permanent position"}, so no ending date is required.
              </p>
            )}

            {offerValidityDays ? (
              <p className="text-gray-500 text-xs bg-primary-800/5 rounded-lg px-3 py-2.5">
                This letter will note the candidate has <strong className="text-primary-800">{offerValidityDays} day{offerValidityDays === 1 ? "" : "s"}</strong> to accept, counted from the letter date.
              </p>
            ) : null}
          </div>

          {otherCandidates.length > 0 && (
            <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-3">
              <button type="button" onClick={() => setBulkOpen((v) => !v)} className="w-full flex items-center justify-between text-zinc-600 text-xs font-bold uppercase tracking-wide">
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Apply to Other Candidates ({otherCandidates.length})
                </span>
                {bulkOpen ? <CheckSquare className="w-4 h-4 text-primary-800" /> : <Square className="w-4 h-4 text-gray-400" />}
              </button>

              {bulkOpen && (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-xs">Select candidates who should receive this exact joining date, ending date, fields, and content.</p>
                  <div className="max-h-56 overflow-y-auto flex flex-col gap-1.5 pr-1">
                    {otherCandidates.map((oc) => {
                      const checked = selectedIds.includes(oc.id);
                      return (
                        <label
                          key={oc.id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] cursor-pointer transition-colors ${
                            checked ? "outline-primary-800 bg-primary-800/5" : "outline-secondary-300 hover:outline-primary-800/40"
                          }`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => toggleSelected(oc.id)} className="w-4 h-4 accent-primary-800 shrink-0 rounded" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{oc.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{oc.jobTitle}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {selectedIds.length > 0 && <p className="text-xs font-semibold text-primary-800">Applies to {selectedIds.length + 1} candidates total.</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="xl:col-span-2 xl:order-1 flex flex-col gap-6">
          {/* Live A4 preview */}
          <div className="p-6 bg-primary-50/60 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center justify-center">
            <div className="w-full max-w-[480px] bg-white shadow-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300/70 rounded-sm">
              <A4Preview
                theme={design?.theme}
                candidate={{ name: candidateDisplayName, email: candidateDisplayEmail, position: candidate?.position || advertisement?.jobTitle, applicationId: candidate?.applicationId }}
                organization={organization}
                advertisement={advertisement}
                colors={design?.colors}
                brandingPreference={design?.brandingPreference}
                logoSize={design?.logoSize}
                headingSize={design?.headingSize}
                bodyFontSize={design?.bodyFontSize}
                signatureSize={design?.signatureSize}
                spacing={design?.spacing}
                formData={liveFormData}
                signature={signature}
                offerValidityDays={offerValidityDays}
                customContent={liveCustomContent}
                maxScale={1}
              />
            </div>
          </div>

          {/* Content editor */}
          <div className="p-6 bg-secondary-50 rounded-2xl shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 text-xs font-bold uppercase tracking-wide">Letter Content</span>
              <button type="button" onClick={handleRegenerateText} className="text-xs font-semibold text-primary-800 hover:text-primary-700 flex items-center gap-1 transition-colors">
                <Sparkles className="w-3 h-3" /> Regenerate Defaults
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 text-xs font-semibold">Paragraph 1 — Opening &amp; Role</label>
              <textarea
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors resize-y"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 text-xs font-semibold">Paragraph 2 — Terms &amp; Compensation</label>
              <textarea
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors resize-y"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 text-xs font-semibold">Paragraph 3 — Closing</label>
              <textarea
                value={paragraph3}
                onChange={(e) => setParagraph3(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors resize-y"
              />
            </div>

            <div className="border-t border-secondary-300 pt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-gray-500 text-xs font-semibold flex items-center gap-1.5">
                  <ListPlus className="w-3.5 h-3.5" /> Additional Fields
                </label>
                <button type="button" onClick={addField} className="text-xs font-semibold text-primary-800 hover:text-primary-700 flex items-center gap-1 transition-colors">
                  <Plus className="w-3 h-3" /> Add Field
                </button>
              </div>
              <input
                type="text"
                value={fieldsSectionLabel}
                onChange={(e) => setFieldsSectionLabel(e.target.value)}
                placeholder={fieldsHeadingPlaceholder}
                className="px-4 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
              />
              <p className="text-gray-400 text-xs -mt-1">Section title shown above these fields on the letter.</p>

              <div className="flex flex-col gap-3">
                {additionalFields.map((f) => (
                  <div key={f.id} className="p-3 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={f.label}
                        onChange={(e) => updateField(f.id, { label: e.target.value })}
                        placeholder="Field label (e.g. Health Insurance)"
                        className="flex-1 px-3 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                      />
                      <button type="button" onClick={() => removeField(f.id)} className="p-1.5 rounded-lg text-gray-500 hover:bg-danger-50 hover:text-danger-600 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      value={f.value}
                      onChange={(e) => updateField(f.id, { value: e.target.value })}
                      rows={2}
                      placeholder="Details shown on the letter for this field…"
                      className="w-full px-3 py-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 bg-secondary-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors resize-y"
                    />
                  </div>
                ))}
                {additionalFields.length === 0 && (
                  <p className="text-gray-400 text-xs italic bg-secondary-100 outline outline-1 outline-dashed outline-offset-[-1px] outline-secondary-300 rounded-xl px-3 py-3 text-center">
                    No additional fields yet — click "Add Field" (e.g. Health Insurance, Stipend Details, Contract Terms).
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}