import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hiring360Logo from "../../assets/images-removebg-preview.png";
import { MenuIcon, CloseIcon, ArrowRightIcon } from "./Icons";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Workflow", href: "#workflow" },
  { label: "Intelligence", href: "#intelligence" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  // Handle scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Highlight active section while scrolling
  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav
          className={`relative flex items-center justify-between rounded-2xl border px-4 py-2.5 sm:px-5 transition-all duration-300 ${
            scrolled || isMenuOpen
              ? "bg-secondary-50/90 backdrop-blur-lg border-secondary-300 shadow-[0_8px_30px_-12px_rgba(76,29,149,0.25)]"
              : "bg-secondary-50/40 backdrop-blur-md border-transparent"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="z-50 shrink-0 flex items-center"
          >
            <img
              src={hiring360Logo}
              alt="Hiring360"
              className="h-12 sm:h-16 w-auto object-contain select-none"
              loading="eager"
              draggable={false}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = activeHash === link.href;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary-900"
                      : "text-primary-900/70 hover:text-primary-900"
                  }`}
                >
                  {link.label}

                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-primary-600 transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 z-50">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-primary-900/70 transition-colors hover:text-primary-900"
            >
              Sign in
            </Link>

            <Link
              to="/login"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary-800 px-4 py-2.5 text-sm font-medium text-secondary-50 shadow-[0_10px_25px_-8px_rgba(91,33,182,0.65)] transition-all hover:bg-primary-700 hover:shadow-[0_12px_28px_-6px_rgba(91,33,182,0.75)] hover:-translate-y-0.5"
            >
              Start demo

              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-primary-900 transition-colors hover:bg-primary-100 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            {isMenuOpen ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            {/* Background Overlay */}
            <div
              onClick={closeMenu}
              className="fixed inset-0 z-30 bg-primary-900/20 backdrop-blur-[2px] md:hidden"
            />

            {/* Mobile Dropdown */}
            <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 px-4 md:hidden">
              <div className="flex flex-col overflow-hidden rounded-2xl border border-secondary-300 bg-secondary-50 p-4 shadow-2xl max-h-[calc(100vh-7rem)] overflow-y-auto">
                {/* Mobile Links */}
                <div className="flex flex-col">
                  {links.map((link) => {
                    const isActive = activeHash === link.href;

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={`rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-primary-50 ${
                          isActive
                            ? "bg-primary-50 text-primary-900"
                            : "text-primary-900/80 hover:text-primary-900"
                        }`}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>

                {/* Mobile Actions */}
                <div className="mt-3 flex flex-col gap-2.5 border-t border-secondary-300 pt-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center rounded-xl bg-secondary-100 px-4 py-3 text-sm font-medium text-primary-900 transition-colors hover:bg-secondary-200"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-800 px-4 py-3 text-sm font-medium text-secondary-50 shadow-lg transition-transform active:scale-[0.98]"
                  >
                    Start demo

                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
