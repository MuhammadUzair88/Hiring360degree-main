export function WorkflowMockup({ image, alt = "" }) {
  return (
    <div className="relative">
      <div
        className="absolute -left-1 -top-1 h-[calc(100%+8px)] w-[calc(100%+8px)] rounded-2xl bg-gradient-to-r from-primary-700 to-primary-300 opacity-25 blur-sm"
        aria-hidden
      />
      <div className="relative flex flex-col overflow-hidden rounded-xl border border-secondary-300 bg-secondary-50 shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)]">
        <div className="flex items-center gap-2 border-b border-secondary-300 bg-secondary-200 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-danger-500/50" />
          <div className="h-3 w-3 rounded-full bg-warning-500/50" />
          <div className="h-3 w-3 rounded-full bg-success-500/50" />
        </div>
        <div className="flex h-72 w-full items-center justify-center bg-secondary-50 sm:h-96">
          <img
            className="h-full w-full object-contain"
            src={image}
            alt={alt}
          />
        </div>
      </div>
    </div>
  );
}

export default WorkflowMockup;