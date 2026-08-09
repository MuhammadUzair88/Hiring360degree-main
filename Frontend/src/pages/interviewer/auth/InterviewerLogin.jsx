// pages/interviewer/auth/InterviewerLogin.jsx
//
// Dedicated login page for the interviewer workspace. Interviewers never
// self-register — an organization admin creates their account (see
// components/organization/interviewer/InterviewerForm.jsx), which emails
// them auto-generated credentials. This page is login-only.
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { validateInterviewerLoginForm } from "../../../utils/validators";

const inputClass =
  "h-12 w-full rounded-2xl border border-secondary-300 bg-secondary-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-primary-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100";

export default function InterviewerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginInterviewer } = useAuth();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateInterviewerLoginForm(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const result = await loginInterviewer(formData);
    setIsSubmitting(false);

    if (result.success) {
      const redirectTo = location.state?.from?.pathname || "/interviewers/dashboard";
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary-100 px-4 py-10 font-sans text-gray-900">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mx-auto mb-8 block w-fit rounded-2xl bg-secondary-50 px-4 py-3 shadow-xl shadow-primary-900/10"
        >
          <img src="/logofull.svg" alt="Hiring360" className="h-9 w-auto object-contain" />
        </button>

        <div className="rounded-[32px] border border-secondary-300 bg-secondary-50 p-6 shadow-[0_24px_70px_rgba(76,29,149,0.08)] sm:p-8">
          <p className="mb-2 text-sm font-medium text-primary-700">Interviewer workspace</p>
          <h1 className="text-3xl leading-tight text-gray-950">Sign in to conduct interviews</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Use the credentials your organization emailed you.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block space-y-2">
              <span className="block text-sm font-medium text-gray-700">Email</span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`${inputClass} pl-11`}
                  placeholder="you@company.com"
                />
              </div>
              {fieldErrors.email && (
                <span className="block text-xs text-red-500">{fieldErrors.email}</span>
              )}
            </label>

            <label className="block space-y-2">
              <span className="block text-sm font-medium text-gray-700">Password</span>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`${inputClass} px-11`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-secondary-200 hover:text-primary-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="block text-xs text-red-500">{fieldErrors.password}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-800 px-5 text-sm text-secondary-50 transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
              {!isSubmitting && (
                <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Hiring organization?{" "}
          <Link to="/login" className="font-medium text-primary-700 hover:underline">
            Sign in to your organization dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
