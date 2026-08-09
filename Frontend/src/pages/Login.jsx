import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
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

const inputClass =
  "h-12 w-full rounded-2xl border border-secondary-300 bg-secondary-50 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-primary-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100";

function Field({ label, children, hint }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-gray-400">{hint}</span> : null}
    </label>
  );
}

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { loginOrganization, registerOrganization } = useAuth();
  const toast = useToast();

  const isLoginView = location.pathname === "/login";
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
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
    } catch (error) {
      toast.error("Logo upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const errors = validateOrgAuthForm({ isLoginView: true, formData });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const result = await loginOrganization({
      email: formData.email.trim(),
      password: formData.password,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const errors = validateOrgAuthForm({ isLoginView: false, formData });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const result = await registerOrganization({
      ...formData,
      email: formData.email.trim(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      website: formData.website.trim(),
      location: formData.location.trim(),
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Workspace created successfully.");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  const submitDisabled = isSubmitting || isUploading;

  return (
    <main className="min-h-screen overflow-hidden bg-secondary-100 font-sans text-gray-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(420px,0.9fr)_minmax(560px,1.1fr)]">
        <aside className="relative hidden overflow-hidden bg-primary-800 px-12 py-10 text-secondary-50 lg:flex lg:flex-col xl:px-16">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.18),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(196,181,253,.35),transparent_34%)]" />
          <div className="absolute -right-32 top-24 h-80 w-80 rounded-full border border-primary-500/40" />
          <div className="absolute -right-16 top-40 h-56 w-56 rounded-full border border-primary-400/30" />

          <button
            type="button"
            onClick={() => navigate("/")}
            className="relative z-10 w-fit rounded-2xl bg-secondary-50 px-4 py-3 shadow-xl shadow-primary-900/20 transition hover:-translate-y-0.5"
          >
            <img
              src="logofull.svg"
              alt="Hiring360"
              className="h-10 w-auto object-contain"
            />
          </button>

          <div className="relative z-10 my-auto max-w-xl">
            <span className="inline-flex items-center rounded-full border border-primary-400/40 bg-primary-700/70 px-4 py-2 text-xs text-primary-100 backdrop-blur">
              Built for modern recruiting teams
            </span>

            <h1 className="mt-7 max-w-lg text-4xl leading-[1.12] text-secondary-50 xl:text-5xl">
              Hiring that feels clear, fast, and human.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-primary-100">
              Bring your team, candidates, and hiring decisions into one focused
              workspace without unnecessary complexity.
            </p>

            <div className="mt-10 grid max-w-md gap-4">
              {[
                "Shorter screening cycles",
                "Better team collaboration",
                "One place for every candidate",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-50/10 ring-1 ring-secondary-50/20">
                    <Check size={15} />
                  </span>
                  <span className="text-sm text-primary-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-primary-200">
            Secure access for your organization workspace.
          </p>
        </aside>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-50 to-transparent lg:hidden" />

          <div className="relative z-10 w-full max-w-[620px]">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-10 rounded-xl lg:hidden"
            >
              <img
                src="/logofullbg.png"
                alt="Hiring360"
                className="h-12 w-auto object-contain"
              />
            </button>

            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-sm font-medium text-primary-700">
                  {isLoginView ? "Welcome back" : "Create your workspace"}
                </p>
                <h2 className="text-3xl leading-tight text-gray-950 sm:text-4xl">
                  {isLoginView ? "Sign in to continue" : "Start with Hiring360"}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                  {isLoginView
                    ? "Use your organization account to access your hiring workspace."
                    : "Set up your organization account and invite your team later."}
                </p>
              </div>
            </div>

            <div className="mb-7 inline-flex rounded-full border border-secondary-300 bg-secondary-50 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`rounded-full px-5 py-2 text-sm transition ${
                  isLoginView
                    ? "bg-primary-800 text-secondary-50 shadow-sm"
                    : "text-gray-500 hover:text-primary-800"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className={`rounded-full px-5 py-2 text-sm transition ${
                  !isLoginView
                    ? "bg-primary-800 text-secondary-50 shadow-sm"
                    : "text-gray-500 hover:text-primary-800"
                }`}
              >
                Create account
              </button>
            </div>

            <div className="rounded-[32px] border border-secondary-300 bg-secondary-50 p-5 shadow-[0_24px_70px_rgba(76,29,149,0.08)] sm:p-8">
              {isLoginView ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <Field label="Work email">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                    {fieldErrors.email && (
                      <span className="mt-1 block text-xs text-red-500">{fieldErrors.email}</span>
                    )}
                  </Field>

                  <Field label="Password">
                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-secondary-200 hover:text-primary-800"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <span className="mt-1 block text-xs text-red-500">{fieldErrors.password}</span>
                    )}
                  </Field>

                  <button
                    type="submit"
                    disabled={submitDisabled}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-800 px-5 text-sm text-secondary-50 transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Signing in…" : "Continue to workspace"}
                    {!isSubmitting && (
                      <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Organization name">
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Acme Technologies"
                      />
                    </Field>

                    <Field label="Business phone">
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="+92 300 1234567"
                      />
                    </Field>

                    <Field label="Industry">
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="tech">Technology</option>
                        <option value="startup">Startup</option>
                      </select>
                    </Field>

                    <Field label="Location">
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Karachi, Pakistan"
                      />
                    </Field>
                  </div>

                  <Field label="Website">
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
                    <Field label="Admin email">
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="admin@company.com"
                      />
                    </Field>

                    <Field label="Password" hint="Use at least 8 characters">
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
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-secondary-200 hover:text-primary-800"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </Field>
                  </div>

                  <Field label="Organization logo">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-primary-300 bg-primary-50/60 p-4 text-left transition hover:border-primary-500 hover:bg-primary-50 disabled:opacity-60"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary-50 text-primary-700 ring-1 ring-primary-200">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                        ) : (
                          <ImagePlus size={20} />
                        )}
                      </span>
                      <span>
                        <span className="block text-sm text-gray-800">
                          {isUploading
                            ? "Uploading logo…"
                            : logoPreview
                              ? "Logo uploaded"
                              : "Upload organization logo"}
                        </span>
                        <span className="mt-1 block text-xs text-gray-400">
                          PNG, JPG or WebP · Maximum 5 MB
                        </span>
                      </span>
                    </button>
                  </Field>

                  <button
                    type="submit"
                    disabled={submitDisabled}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-800 px-5 text-sm text-secondary-50 transition hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Creating workspace…" : "Create organization"}
                    {!isSubmitting && (
                      <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              Protected organization access · Hiring360
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              Interviewer?{" "}
              <Link to="/interviewers/login" className="font-medium text-primary-700 hover:underline">
                Sign in to your interviewer workspace
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}