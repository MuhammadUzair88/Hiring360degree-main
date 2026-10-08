import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { LinkedInIcon } from "./Icons";

// ---------------------------------------------------------------------
// NOTE: FacebookIcon, InstagramIcon and WhatsAppIcon are defined locally
// below since they weren't in your existing ./icons file. If you'd
// rather keep all icons together, just move these three svg functions
// into ./icons.jsx and import them the same way LinkedInIcon is used.
// ---------------------------------------------------------------------

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.916 3.777-3.916 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.13-1.55a9.87 9.87 0 0 0 4.91 1.29h.01c5.46 0 9.91-4.45 9.91-9.92S17.5 2 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.05.92.92-3-.19-.31a8.22 8.22 0 1 1 6.81 3.72zm4.5-6.15c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.17.25-.65.8-.8.96-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.9 2.42 1.02 2.58.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

const footerLinks = [
  {
    heading: "Product",
    items: [
      { label: "Platform", href: "#platform" },
      { label: "Workflow Engine", href: "#workflow" },
      { label: "Hiring Intelligence", href: "#intelligence" },
      { label: "Integrations", href: "#platform" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About Us", href: "#" },
      { label: "Customer Stories", href: "#" },
      { label: "Careers", href: "#" },
      {
        label: "Contact",
        href: "https://wa.me/923130343953",
        external: true,
      },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Security Center", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61566693981468",
    Icon: FacebookIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/hiring360degree/",
    Icon: LinkedInIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923130343953",
    Icon: WhatsAppIcon,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-background/80 pt-24 pb-12 backdrop-blur-sm">
      {/* =====================================================
          Giant Background Logo Watermark
      ====================================================== */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex w-full -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center opacity-[0.03] dark:opacity-[0.02]">
        <Logo className="scale-[8] sm:scale-[12]" />
      </div>

      {/* =====================================================
          Ambient Bottom Glow
      ====================================================== */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[300px] w-[600px] -translate-x-1/2 rounded-t-full bg-primary-500/5 blur-[120px]" />

      {/* =====================================================
          Main Footer Container
      ====================================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-8">

          {/* =================================================
              Brand & Newsletter
          ================================================== */}
          <div className="flex flex-col lg:col-span-2">
            {/* Logo */}
            <Link
              to="/"
              aria-label="Hiring360 Home"
              className="group mx-auto flex w-max items-center lg:mx-0"
            >
              <Logo className="transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Description */}
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The AI-powered hiring intelligence platform. Automate every
              stage, discover hidden talent, and decide with complete clarity.
            </p>

            {/* Newsletter */}
            {/* NOTE: this only prevents page reload for now — wire up an
                email provider (Mailchimp, Resend, etc.) to make it actually
                subscribe someone. Happy to help with that once you pick one. */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex w-full max-w-sm items-center gap-2 rounded-full border border-primary-500 bg-secondary-50/5 p-1 backdrop-blur-md transition-colors focus-within:border-primary-500/50 focus-within:bg-secondary-50/10"
            >
              <input
                type="email"
                placeholder="Subscribe to updates..."
                aria-label="Email address"
                required
                className="w-full bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-primary-600 to-primary-400 px-4 py-2 text-xs font-semibold text-secondary-50 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Join
              </button>
            </form>
          </div>

          {/* =================================================
              Footer Link Columns
          ================================================== */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4 lg:ml-auto">
            {footerLinks.map((column) => (
              <div key={column.heading}>
                {/* Heading */}
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  {column.heading}
                </h3>

                {/* Links */}
                <ul className="mt-6 space-y-4 text-sm">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        {...(item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="inline-block text-muted-foreground transition-all duration-200 hover:translate-x-1 hover:text-primary-400"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            Bottom Bar
        ====================================================== */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-secondary-100/10 pt-8 sm:flex-row">

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} Hiring360°. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <a
              href="#"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-foreground"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="transition-colors hover:text-foreground"
            >
              Cookie Settings
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-muted-foreground">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} social link`}
                className="group p-2"
              >
                <Icon
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary-400"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
