import hiring360Logo from "../../assets/image-removebg-preview.png";

/**
 * Brand mark used in the Navbar and Footer.
 * Renders the actual logo asset from /assets — centered in its own
 * container so it drops in cleanly wherever it's placed.
 */
export function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={hiring360Logo}
        alt="Hiring360"
        className="h-9 w-auto select-none object-contain"
        draggable={false}
      />
    </span>
  );
}