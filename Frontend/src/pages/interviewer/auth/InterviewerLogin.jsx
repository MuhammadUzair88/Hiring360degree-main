
import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  CalendarCheck2,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { validateInterviewerLoginForm } from "../../../utils/validators";

const inputClass = `
  h-12 w-full rounded-xl
  border border-secondary-300
  bg-white
  px-4
  text-sm text-gray-900
  outline-none
  transition-all duration-200
  placeholder:text-gray-400
  hover:border-primary-300
  focus:border-primary-600
  focus:ring-4 focus:ring-primary-100
`;

export default function InterviewerLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const { loginInterviewer } = useAuth();
  const toast = useToast();

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [fieldErrors, setFieldErrors] =
    useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({
    target: { name, value },
  }) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors =
      validateInterviewerLoginForm(
        formData
      );

    setFieldErrors(errors);

    if (
      Object.keys(errors).length > 0
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await loginInterviewer({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (result.success) {
        const redirectTo =
          location.state?.from
            ?.pathname ||
          "/interviewers/dashboard";

        navigate(redirectTo, {
          replace: true,
        });
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary-100 font-sans text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        {/* INTERVIEWER BRAND SIDE */}
        <aside className="relative hidden min-h-screen overflow-hidden bg-primary-900 lg:flex lg:flex-col">
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl" />

            <div className="absolute -bottom-44 right-0 h-[460px] w-[460px] rounded-full bg-primary-600/20 blur-3xl" />

            <div
              className="
                absolute inset-0 opacity-[0.07]
                [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)]
                [background-size:42px_42px]
              "
            />
          </div>

          <div className="relative z-10 flex min-h-screen flex-col px-10 py-9 xl:px-14">
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="w-fit rounded-xl bg-white px-4 py-3 shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
            >
              <img
                src="/logofull.svg"
                alt="Hiring360"
                className="h-9 w-auto object-contain"
              />
            </button>

            <div className="my-auto max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-primary-50 backdrop-blur">
                <Sparkles size={14} />
                Interviewer workspace
              </div>

              <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[52px]">
                Everything you need to conduct a great interview.
              </h1>

              <p className="mt-5 max-w-lg text-[15px] leading-7 text-primary-100">
                Review candidates, join scheduled interviews,
                collaborate with your hiring team and submit
                evaluations from one focused workspace.
              </p>

              <div className="mt-10 grid gap-4">
                <div className="flex max-w-lg items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Video size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Conduct interviews
                    </p>

                    <p className="mt-1 text-xs leading-5 text-primary-200">
                      Join your assigned interview sessions directly
                      from Hiring360.
                    </p>
                  </div>
                </div>

                <div className="flex max-w-lg items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <CalendarCheck2 size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Stay organized
                    </p>

                    <p className="mt-1 text-xs leading-5 text-primary-200">
                      See upcoming interviews, candidates and round
                      information in one place.
                    </p>
                  </div>
                </div>

                <div className="flex max-w-lg items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Secure interviewer access
                    </p>

                    <p className="mt-1 text-xs leading-5 text-primary-200">
                      Access is limited to interviewer accounts created
                      by your organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-primary-200">
              <ShieldCheck size={14} />
              Protected interviewer workspace
            </div>
          </div>
        </aside>

        {/* LOGIN SIDE */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-primary-100/70 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-primary-50 blur-3xl" />

          <div className="relative z-10 w-full max-w-[520px]">
            {/* mobile logo */}
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="mb-9 block w-fit lg:hidden"
            >
              <img
                src="/logofullbg.png"
                alt="Hiring360"
                className="h-11 w-auto object-contain"
              />
            </button>

            <div className="mb-7">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
                <Headphones size={20} />
              </div>

              <p className="mb-2 text-sm font-semibold text-primary-700">
                Interviewer portal
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                Sign in with the credentials provided by your hiring
                organization.
              </p>
            </div>

            <div className="rounded-3xl border border-secondary-300 bg-white p-6 shadow-[0_22px_60px_rgba(76,29,149,0.08)] sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Work email
                  </span>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      required
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
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {fieldErrors.email}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </span>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      required
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      className={`${inputClass} px-11`}
                      placeholder="Enter your password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-secondary-100 hover:text-primary-800"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {fieldErrors.password && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group flex h-12 w-full items-center justify-center gap-2
                    rounded-xl bg-primary-800
                    text-sm font-semibold text-white
                    shadow-lg shadow-primary-800/10
                    transition
                    hover:bg-primary-900
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in to workspace

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-xl bg-secondary-100 px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-primary-700"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Interviewer accounts are created by organization
                    administrators. If you cannot sign in, contact your
                    hiring organization for account assistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Hiring organization?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary-700 transition hover:text-primary-900 hover:underline"
                >
                  Organization sign in
                </Link>
              </p>

              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck size={13} />
                Secure Hiring360 interviewer access
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}