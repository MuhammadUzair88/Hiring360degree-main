import React, { useEffect, useRef, useState } from "react";

const INITIAL_CODE = "// Work through the problem together.\n\n";

export default function CollaborativeCodePanel({
  codingSession,
  languages,
  isLoadingLanguages,
  onSave,
  onRun,
}) {
  const [sourceCode, setSourceCode] = useState(
    codingSession.sourceCode || INITIAL_CODE
  );
  const [stdin, setStdin] = useState(codingSession.stdin || "");
  const [languageId, setLanguageId] = useState(
    codingSession.languageId ? String(codingSession.languageId) : ""
  );
  const [isDirty, setIsDirty] = useState(false);
  const [syncStatus, setSyncStatus] = useState("saved");
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState("");
  const lastRevision = useRef(-1);
  const draftRef = useRef({ sourceCode, stdin, languageId });

  useEffect(() => {
    if (!languages.length) return;

    const selected = codingSession.languageId
      ? String(codingSession.languageId)
      : String(languages[0].id);
    setLanguageId(selected);
    draftRef.current = { ...draftRef.current, languageId: selected };

    if (!codingSession.languageId) {
      setIsDirty(true);
    }
  }, [codingSession.languageId, languages]);

  useEffect(() => {
    const revision = Number(codingSession.revision || 0);
    if (revision <= lastRevision.current) return;

    lastRevision.current = revision;
    const nextCode = codingSession.sourceCode || INITIAL_CODE;
    const nextStdin = codingSession.stdin || "";
    const nextLanguageId = codingSession.languageId
      ? String(codingSession.languageId)
      : languageId;

    draftRef.current = {
      sourceCode: nextCode,
      stdin: nextStdin,
      languageId: nextLanguageId,
    };
    setSourceCode(nextCode);
    setStdin(nextStdin);
    if (nextLanguageId) setLanguageId(nextLanguageId);
    setIsDirty(false);
    setSyncStatus("saved");
  }, [codingSession.revision]);

  useEffect(() => {
    if (!isDirty || !languageId) return undefined;

    const snapshot = { sourceCode, stdin, languageId: Number(languageId) };
    draftRef.current = { sourceCode, stdin, languageId };
    setSyncStatus("syncing");

    const timer = window.setTimeout(async () => {
      try {
        await onSave(snapshot);
        if (
          draftRef.current.sourceCode === snapshot.sourceCode &&
          draftRef.current.stdin === snapshot.stdin &&
          draftRef.current.languageId === String(snapshot.languageId)
        ) {
          setIsDirty(false);
          setSyncStatus("saved");
        }
      } catch (error) {
        setSyncStatus("offline");
        console.error("Code editor sync failed:", error);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [isDirty, languageId, onSave, sourceCode, stdin]);

  const updateDraft = (next) => {
    draftRef.current = { ...draftRef.current, ...next };
    setIsDirty(true);
  };

  const handleRun = async () => {
    if (!languageId || isRunning) return;
    setIsRunning(true);
    setRunError("");
    setRunResult(null);

    const submission = {
      sourceCode,
      stdin,
      languageId: Number(languageId),
    };

    try {
      await onSave(submission);
      setIsDirty(false);
      setSyncStatus("saved");
      const result = await onRun(submission);
      setRunResult(result);
    } catch (error) {
      setRunError(error.message || "Unable to run this program.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-slate-950 text-slate-100">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700 p-3">
        <select
          aria-label="Programming language"
          value={languageId}
          onChange={(event) => {
            setLanguageId(event.target.value);
            updateDraft({ languageId: event.target.value });
          }}
          className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
        >
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-400">
          {syncStatus === "saved"
            ? "Shared"
            : syncStatus === "syncing"
              ? "Syncing…"
              : "Sync failed"}
        </span>
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning || !languageId || !languages.length}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "Running…" : "Run code"}
        </button>
      </div>

      {!languages.length ? (
        <div className="p-4 text-sm text-amber-200">
          {isLoadingLanguages
            ? "Loading programming languages..."
            : "The compiler service is unavailable. Check the backend runtime logs."}
        </div>
      ) : (
        <>
          <textarea
            aria-label="Shared source code"
            spellCheck={false}
            value={sourceCode}
            onChange={(event) => {
              setSourceCode(event.target.value);
              updateDraft({ sourceCode: event.target.value });
            }}
            className="min-h-48 flex-1 resize-none border-0 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            placeholder="Write code here; changes are shared with both participants."
          />

          <label className="border-t border-slate-700 p-3">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Standard input
            </span>
            <textarea
              aria-label="Program input"
              spellCheck={false}
              value={stdin}
              onChange={(event) => {
                setStdin(event.target.value);
                updateDraft({ stdin: event.target.value });
              }}
              rows={3}
              className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900 p-3 font-mono text-xs text-slate-100 outline-none focus:border-primary-500"
              placeholder="Input passed to the program"
            />
          </label>
        </>
      )}

      <div className="max-h-52 overflow-auto border-t border-slate-700 bg-black/30 p-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Output
        </div>
        {runError ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-xs text-rose-300">
            {runError}
          </pre>
        ) : runResult ? (
          <>
            <p className="mb-2 text-xs text-slate-300">{runResult.status}</p>
            <pre className="whitespace-pre-wrap break-words font-mono text-xs text-emerald-200">
              {runResult.stdout || "(no standard output)"}
            </pre>
            {(runResult.compileOutput || runResult.stderr || runResult.message) && (
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs text-rose-300">
                {[runResult.compileOutput, runResult.stderr, runResult.message]
                  .filter(Boolean)
                  .join("\n")}
              </pre>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-500">Run code to see output.</p>
        )}
        <p className="mt-3 text-[10px] leading-4 text-slate-500">
          Code is sent to Judge0 for compilation and execution.
        </p>
      </div>
    </section>
  );
}
