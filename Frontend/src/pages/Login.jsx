
import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateOrgAuthForm } from "../utils/validators";
import { uploadImageToCloudinary } from "../utils/uploadImage";

const INITIAL_FORM_DATA = {
  email: "",
  password: "",
  name: "",
  phone: "",
  industry: "tech",
  website: "",
  location: "",
  logo: "",
};

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

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700">{label}</span>

        {hint && (
          <span className="text-[11px] text-gray-400">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </label>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-primary-900 lg:flex lg:flex-col">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary-600/30 blur-3xl" />
        <div className="absolute -bottom-48 right-0 h-[480px] w-[480px] rounded-full bg-primary-500/20 blur-3xl" />

        <div
          className="
            absolute inset-0 opacity-[0.07]
            [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)]
            [background-size:42px_42px]
          "
        />
      </div>

      <div className="relative z-10 flex h-full min-h-screen flex-col px-10 py-9 xl:px-14">
        <Link
          to="/"
          className="w-fit rounded-xl bg-white px-4 py-3 shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
        >
          <img
            src="/logofull.svg"
            alt="Hiring360"
            className="h-9 w-auto object-contain"
          />
        </Link>

        <div className="my-auto max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-primary-50 backdrop-blur">
            <Sparkles size={14} />
            Modern recruitment, one workspace
          </div>

          <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[52px]">
            Build better teams with a clearer hiring process.
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-7 text-primary-100">
            Manage candidates, interviewers, interviews, evaluations and offers
            from one professional recruitment workspace.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              {
                icon: BriefcaseBusiness,
                title: "Centralized hiring",
                text: "Keep every job and candidate in one place.",
              },
              {
                icon: ShieldCheck,
                title: "Structured access",
                text: "Dedicated organization and interviewer workspaces.",
              },
              {
                icon: Check,
                title: "Faster decisions",
                text: "Move candidates through your pipeline with clarity.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex max-w-lg items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/10">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-primary-200">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-primary-200">
          <ShieldCheck size={14} />
          Secure Hiring360 organization access
        </div>
      </div>
    </aside>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const { loginOrganization, registerOrganization } = useAuth();
  const toast = useToast();

  const isLoginView = location.pathname === "/login";

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = ({ target: { name, value } }) => {
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

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The logo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const secureUrl = await uploadImageToCloudinary(file);

      setFormData((current) => ({
        ...current,
        logo: secureUrl,
      }));

      setLogoPreview(secureUrl);

      toast.success("Logo uploaded.");
    } catch {
      toast.error("Logo upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const errors = validateOrgAuthForm({
      isLoginView: true,
      formData,
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const result = await loginOrganization({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        const redirectTo =
          location.state?.from?.pathname || "/";

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

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const errors = validateOrgAuthForm({
      isLoginView: false,
      formData,
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const result = await registerOrganization({
        ...formData,
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        location: formData.location.trim(),
      });

      if (result.success) {
        toast.success("Organization workspace created.");
        navigate("/", {
          replace: true,
        });
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDisabled = isSubmitting || isUploading;

  return (
    <main className="min-h-screen bg-secondary-100 font-sans text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <BrandPanel />

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-12">
          {/* right-side decorations */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-primary-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-primary-50 blur-3xl" />

          <div className="relative z-10 w-full max-w-[610px]">
            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-9 block w-fit lg:hidden"
            >
              <img
                src="/logofullbg.png"
                alt="Hiring360"
                className="h-11 w-auto object-contain"
              />
            </Link>

            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold text-primary-700">
                {isLoginView
                  ? "Organization portal"
                  : "New organization"}
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                {isLoginView
                  ? "Welcome back"
                  : "Create your hiring workspace"}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                {isLoginView
                  ? "Sign in to manage jobs, candidates, interviews and hiring decisions."
                  : "Set up your organization profile and start managing your recruitment process."}
              </p>
            </div>

            {/* Switch */}
            <div className="mb-6 grid grid-cols-2 rounded-xl border border-secondary-300 bg-secondary-200/60 p-1">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`
                  rounded-lg px-4 py-2.5 text-sm font-medium transition
                  ${
                    isLoginView
                      ? "bg-white text-primary-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }
                `}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className={`
                  rounded-lg px-4 py-2.5 text-sm font-medium transition
                  ${
                    !isLoginView
                      ? "bg-white text-primary-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }
                `}
              >
                Create account
              </button>
            </div>

            <div className="rounded-3xl border border-secondary-300 bg-white p-5 shadow-[0_22px_60px_rgba(76,29,149,0.08)] sm:p-7">
              {isLoginView ? (
                <form
                  onSubmit={handleLoginSubmit}
                  className="space-y-5"
                >
                  <Field
                    label="Work email"
                    error={fieldErrors.email}
                  >
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
                        onChange={handleInputChange}
                        autoComplete="email"
                        className={`${inputClass} pl-11`}
                        placeholder="name@company.com"
                      />
                    </div>
                  </Field>

                  <Field
                    label="Password"
                    error={fieldErrors.password}
                  >
                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                        className={`${inputClass} px-11`}
                        placeholder="Enter your password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
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
                  </Field>

                  <button
                    type="submit"
                    disabled={submitDisabled}
                    className="
                      group flex h-12 w-full items-center justify-center gap-2
                      rounded-xl bg-primary-800 px-5
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
                        Continue to workspace
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleRegisterSubmit}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Organization name"
                      error={fieldErrors.name}
                    >
                      <div className="relative">
                        <Building2
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-11`}
                          placeholder="Acme Technologies"
                        />
                      </div>
                    </Field>

                    <Field
                      label="Business phone"
                      error={fieldErrors.phone}
                    >
                      <div className="relative">
                        <Phone
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-11`}
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Industry"
                      error={fieldErrors.industry}
                    >
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="tech">
                          Technology
                        </option>

                        <option value="startup">
                          Startup
                        </option>
                      </select>
                    </Field>

                    <Field
                      label="Location"
                      error={fieldErrors.location}
                    >
                      <div className="relative">
                        <MapPin
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-11`}
                          placeholder="Karachi, Pakistan"
                        />
                      </div>
                    </Field>
                  </div>

                  <Field
                    label="Website"
                    error={fieldErrors.website}
                    hint="Optional"
                  >
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="https://example.com"
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Admin email"
                      error={fieldErrors.email}
                    >
                      <div className="relative">
                        <Mail
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-11`}
                          placeholder="admin@company.com"
                        />
                      </div>
                    </Field>

                    <Field
                      label="Password"
                      error={fieldErrors.password}
                      hint="8+ characters"
                    >
                      <div className="relative">
                        <input
                          required
                          minLength={8}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`${inputClass} pr-11`}
                          placeholder="Create password"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-secondary-100 hover:text-primary-800"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </Field>
                  </div>

                  <Field
                    label="Organization logo"
                    error={fieldErrors.logo}
                    hint="PNG, JPG or WebP · max 5 MB"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="
                        flex w-full items-center gap-4
                        rounded-xl border border-dashed border-primary-300
                        bg-primary-50/50 p-4 text-left
                        transition
                        hover:border-primary-500 hover:bg-primary-50
                        disabled:cursor-not-allowed disabled:opacity-60
                      "
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary-200 bg-white text-primary-700">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Organization logo"
                            className="h-full w-full object-cover"
                          />
                        ) : isUploading ? (
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                        ) : (
                          <ImagePlus size={19} />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {isUploading
                            ? "Uploading logo…"
                            : logoPreview
                              ? "Organization logo uploaded"
                              : "Choose organization logo"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Click to select an image
                        </p>
                      </div>
                    </button>
                  </Field>

                  <button
                    type="submit"
                    disabled={submitDisabled}
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
                        Creating workspace…
                      </>
                    ) : (
                      <>
                        Create organization
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-gray-400">
              <p className="flex items-center gap-1.5">
                <ShieldCheck size={13} />
                Secure access powered by Hiring360
              </p>

              <p>
                Interviewer?{" "}
                <Link
                  to="/interviewers/login"
                  className="font-semibold text-primary-700 transition hover:text-primary-900 hover:underline"
                >
                  Open interviewer workspace
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}