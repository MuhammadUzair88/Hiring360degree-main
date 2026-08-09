// src/utils/validators.js

export function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone = "") {
  return /^[+]?[\d\s-]{7,15}$/.test(phone.trim());
}

export function isNonEmpty(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function minLength(value = "", length) {
  return value.trim().length >= length;
}

/**
 * Validates an organization login/register form.
 * Returns a { fieldName: message } map. Empty object means valid.
 */
export function validateOrgAuthForm({ isLoginView, formData }) {
  const errors = {};

  if (!isNonEmpty(formData.email)) errors.email = "Email is required.";
  else if (!isValidEmail(formData.email)) errors.email = "Enter a valid email address.";

  if (!isNonEmpty(formData.password)) errors.password = "Password is required.";
  else if (!minLength(formData.password, 6)) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!isLoginView) {
    if (!isNonEmpty(formData.name)) errors.name = "Organization name is required.";
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = "Enter a valid phone number.";
    }
  }

  return errors;
}

export function validateInterviewerLoginForm({ email, password }) {
  const errors = {};
  if (!isNonEmpty(email)) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isNonEmpty(password)) errors.password = "Password is required.";
  return errors;
}
