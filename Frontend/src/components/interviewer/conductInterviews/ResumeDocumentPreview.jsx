// src/components/interviewerDashboard/conductInterview/ResumeDocumentPreview.jsx

import React from "react";
import { Download, Printer, ExternalLink } from "lucide-react";

/**
 * Renders the candidate's structured resume data as a styled document,
 * matching the Figma "generated resume" mockup 1:1 — same paper
 * proportions, same section order, same typography rhythm. Unlike the
 * old page's <iframe> file preview, this one composes real resume
 * data as props, so it works with dummy data today and a fetched
 * resume object later without needing an uploaded file at all.
 */
export default function ResumeDocumentPreview({ candidateName, jobTitleTarget, resume }) {
  const handlePrint = () => window.print();

  return (
    <div className="self-stretch flex-1 p-4 sm:p-8 bg-zinc-600 shadow-[inset_0px_0px_10px_0px_rgba(0,0,0,0.20)] flex justify-center items-start overflow-y-auto">
      <div className="w-full max-w-[800px] min-h-[1100px] bg-secondary-50 shadow-[0px_10px_25px_0px_rgba(0,0,0,0.10)] flex flex-col">
        {/* Floating action row */}
        <div className="p-4 sm:p-6 flex justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Print"
              onClick={handlePrint}
              className="w-10 h-10 bg-secondary-50 rounded-full outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] flex items-center justify-center text-gray-700 hover:text-primary-800 transition-colors"
            >
              <Printer size={16} />
            </button>
            <a
              href={resume?.fileUrl || "#"}
              download
              title="Download"
              className="w-10 h-10 bg-secondary-50 rounded-full outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] flex items-center justify-center text-gray-700 hover:text-primary-800 transition-colors"
            >
              <Download size={16} />
            </a>
            <a
              href={resume?.fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="w-10 h-10 bg-secondary-50 rounded-full outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] flex items-center justify-center text-gray-700 hover:text-primary-800 transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="flex-1 px-6 sm:px-12 pb-8 flex flex-col justify-between gap-8">
          {/* Header */}
          <div className="pb-6 border-b-2 border-primary-800 flex flex-col sm:flex-row justify-between items-start gap-3">
            <div>
              <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold leading-10 uppercase">{candidateName}</h2>
              <p className="text-primary-800 text-sm font-semibold leading-5 tracking-wider uppercase">{jobTitleTarget}</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              {resume.location && <p className="text-gray-700 text-sm leading-5">{resume.location}</p>}
              {resume.linkedin && <p className="text-gray-700 text-sm leading-5">{resume.linkedin}</p>}
              {resume.github && <p className="text-gray-700 text-sm leading-5">{resume.github}</p>}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-8">
            {resume.experience?.length > 0 && (
              <section className="flex flex-col gap-4">
                <h3 className="pb-1 border-b border-secondary-300 text-slate-900 text-lg font-bold leading-7">Experience</h3>
                <div className="flex flex-col gap-6">
                  {resume.experience.map((job, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-1">
                        <span className="text-slate-900 text-base font-bold leading-6">
                          {job.title} | {job.company}
                        </span>
                        <span className="text-gray-700 text-sm leading-5 shrink-0">{job.period}</span>
                      </div>
                      <ul className="flex flex-col gap-1">
                        {job.bullets.map((line, lineIndex) => (
                          <li key={lineIndex} className="pl-4 relative text-gray-700 text-sm leading-5">
                            <span className="absolute left-0">•</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resume.projects?.length > 0 && (
              <section className="flex flex-col gap-4">
                <h3 className="pb-1 border-b border-secondary-300 text-slate-900 text-lg font-bold leading-7">Projects</h3>
                <div className="flex flex-col gap-3">
                  {resume.projects.map((project, index) => (
                    <div key={index}>
                      <p className="text-slate-900 text-base font-bold leading-6">{project.title}</p>
                      <p className="text-gray-700 text-sm leading-5">{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resume.skills?.length > 0 && (
              <section className="flex flex-col gap-4">
                <h3 className="pb-1 border-b border-secondary-300 text-slate-900 text-lg font-bold leading-7">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-primary-50 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-slate-900 text-[10px] font-bold uppercase leading-4"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {resume.education && (
              <section className="flex flex-col gap-4">
                <h3 className="pb-1 border-b border-secondary-300 text-slate-900 text-lg font-bold leading-7">Education</h3>
                <div>
                  <p className="text-slate-900 text-sm font-bold leading-5">{resume.education.degree}</p>
                  <p className="text-gray-700 text-sm leading-5">{resume.education.school}</p>
                  <p className="text-gray-700 text-sm leading-5">{resume.education.period}</p>
                </div>
              </section>
            )}

            {resume.languages?.length > 0 && (
              <section className="flex flex-col gap-4">
                <h3 className="pb-1 border-b border-secondary-300 text-slate-900 text-lg font-bold leading-7">Languages</h3>
                <div className="flex flex-col gap-1">
                  {resume.languages.map((language) => (
                    <div key={language.name} className="flex justify-between items-start">
                      <span className="text-slate-900 text-sm leading-5">{language.name}</span>
                      <span className="text-primary-800 text-sm font-bold leading-5">{language.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="pt-12 flex flex-col items-center">
            <span className="text-gray-500 text-[10px] uppercase leading-4 tracking-wide">
              Generated via Hiring360 Talent Ecosystem
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}