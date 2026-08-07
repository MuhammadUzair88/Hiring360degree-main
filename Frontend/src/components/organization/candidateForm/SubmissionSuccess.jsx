import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function SubmissionSuccess({ organizationName }) {
  return (
    <div className="text-center py-10 sm:py-12">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-success-100 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-success-600" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
        Application Submitted!
      </h2>

      <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
        Thank you for applying to{" "}
        <span className="font-semibold text-slate-900">{organizationName}</span>.
        We've received your application and resume — our hiring team will
        review your profile and reach out soon.
      </p>
    </div>
  );
}