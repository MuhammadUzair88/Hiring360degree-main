import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  X,
  Check,
} from "lucide-react";

const inputClass =
  "h-12 w-full rounded-xl border border-secondary-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-100";

/*
 * IMPORTANT:
 * This component MUST stay outside UpdatePasswordModal.
 *
 * If it is declared inside UpdatePasswordModal, React receives a new
 * component type after every keystroke and the input loses focus.
 */
function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  placeholder,
  disabled = false,
  error = "",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <div className="relative">
        <LockKeyhole
          className={`
            absolute left-4 top-1/2 h-4 w-4
            -translate-y-1/2
            ${
              error
                ? "text-red-400"
                : "text-gray-400"
            }
          `}
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${inputClass}
            pl-11 pr-12
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : ""
            }
            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:opacity-70
          `}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="
            absolute right-2 top-1/2
            flex h-9 w-9
            -translate-y-1/2
            items-center justify-center
            rounded-lg
            text-gray-400
            transition
            hover:bg-secondary-100
            hover:text-primary-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function Requirement({
  passed,
  children,
}) {
  return (
    <div
      className={`
        flex items-center gap-2
        text-xs
        transition-colors
        ${
          passed
            ? "text-emerald-700"
            : "text-gray-500"
        }
      `}
    >
      <span
        className={`
          flex h-4 w-4
          shrink-0
          items-center justify-center
          rounded-full
          ${
            passed
              ? "bg-emerald-100"
              : "bg-gray-200"
          }
        `}
      >
        {passed && (
          <Check className="h-2.5 w-2.5" />
        )}
      </span>

      <span>{children}</span>
    </div>
  );
}

export default function UpdatePasswordModal({
  open = false,
  isSubmitting = false,
  onClose = () => {},
  onSubmit = async () => ({
    success: false,
  }),
}) {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});

  /*
   * Reset only when the dialog changes
   * from closed -> open.
   */
  useEffect(() => {
    if (!open) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);

    setError("");
    setFieldErrors({});
  }, [open]);

  /*
   * Escape key support.
   */
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    isSubmitting,
    onClose,
  ]);

  /*
   * Prevent the page behind the modal
   * from scrolling.
   */
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  const passwordChecks =
    useMemo(
      () => ({
        length:
          newPassword.length >= 8,

        different:
          Boolean(newPassword) &&
          newPassword !==
            currentPassword,

        matches:
          Boolean(confirmPassword) &&
          confirmPassword ===
            newPassword,
      }),
      [
        currentPassword,
        newPassword,
        confirmPassword,
      ]
    );

  const clearFieldError = (
    field
  ) => {
    setFieldErrors(
      (previous) => {
        if (!previous[field]) {
          return previous;
        }

        return {
          ...previous,
          [field]: "",
        };
      }
    );

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    const nextErrors = {};

    if (!currentPassword.trim()) {
      nextErrors.currentPassword =
        "Enter your current password.";
    }

    if (!newPassword) {
      nextErrors.newPassword =
        "Enter a new password.";
    } else if (
      newPassword.length < 8
    ) {
      nextErrors.newPassword =
        "New password must contain at least 8 characters.";
    } else if (
      newPassword ===
      currentPassword
    ) {
      nextErrors.newPassword =
        "New password must be different from your current password.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Confirm your new password.";
    } else if (
      newPassword !==
      confirmPassword
    ) {
      nextErrors.confirmPassword =
        "New password and confirmation do not match.";
    }

    setFieldErrors(nextErrors);

    if (
      Object.keys(nextErrors)
        .length > 0
    ) {
      return;
    }

    try {
      const result =
        await onSubmit({
          currentPassword,
          newPassword,
        });

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to update password."
        );

        return;
      }

      /*
       * Parent normally closes
       * the modal after success.
       * No need to reset state here.
       */
    } catch (submitError) {
      console.error(
        "Update password error:",
        submitError
      );

      setError(
        "Unable to update password. Please try again."
      );
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* Backdrop */}
      <button
        type="button"
        className="
          absolute inset-0
          cursor-default
          bg-slate-950/45
          backdrop-blur-[2px]
        "
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
        aria-label="Close password dialog"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-password-title"
        className="
          relative z-10
          w-full max-w-md
          overflow-hidden
          rounded-3xl
          border border-secondary-300
          bg-white
          shadow-[0_28px_80px_rgba(15,23,42,0.22)]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-secondary-200
            px-6 py-5
          "
        >
          <div className="flex items-start gap-3">
            <span
              className="
                flex h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary-50
                text-primary-700
              "
            >
              <ShieldCheck className="h-5 w-5" />
            </span>

            <div>
              <h2
                id="update-password-title"
                className="text-lg font-semibold text-slate-900"
              >
                Update password
              </h2>

              <p className="mt-1 max-w-[300px] text-sm leading-5 text-gray-500">
                Confirm your current
                password before setting
                a new one.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-secondary-100
              hover:text-gray-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6"
        >
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              clearFieldError(
                "currentPassword"
              );
            }}
            visible={showCurrent}
            onToggle={() =>
              setShowCurrent(
                (value) => !value
              )
            }
            autoComplete="current-password"
            placeholder="Enter current password"
            disabled={isSubmitting}
            error={
              fieldErrors.currentPassword
            }
          />

          <PasswordField
            label="New password"
            value={newPassword}
            onChange={(value) => {
              setNewPassword(value);
              clearFieldError(
                "newPassword"
              );
            }}
            visible={showNew}
            onToggle={() =>
              setShowNew(
                (value) => !value
              )
            }
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            disabled={isSubmitting}
            error={
              fieldErrors.newPassword
            }
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              clearFieldError(
                "confirmPassword"
              );
            }}
            visible={showConfirm}
            onToggle={() =>
              setShowConfirm(
                (value) => !value
              )
            }
            autoComplete="new-password"
            placeholder="Re-enter new password"
            disabled={isSubmitting}
            error={
              fieldErrors.confirmPassword
            }
          />

          {/* Requirements */}
          <div
            className="
              grid
              grid-cols-1
              gap-2.5
              rounded-xl
              border
              border-secondary-200
              bg-secondary-100
              px-4 py-3
              sm:grid-cols-2
            "
          >
            <Requirement
              passed={
                passwordChecks.length
              }
            >
              At least 8 characters
            </Requirement>

            <Requirement
              passed={
                passwordChecks.different
              }
            >
              Different from current
            </Requirement>

            <Requirement
              passed={
                passwordChecks.matches
              }
            >
              Passwords match
            </Requirement>
          </div>

          {/* Server error */}
          {error && (
            <div
              role="alert"
              className="
                rounded-xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              pt-1
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                rounded-xl
                border
                border-secondary-300
                bg-white
                px-4 py-2.5
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:bg-secondary-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !currentPassword ||
                !passwordChecks.length ||
                !passwordChecks.different ||
                !passwordChecks.matches
              }
              className="
                flex
                min-w-[160px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary-800
                px-5 py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-primary-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Updating…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}