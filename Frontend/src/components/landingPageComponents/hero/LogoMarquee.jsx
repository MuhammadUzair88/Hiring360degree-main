import { motion } from "framer-motion";

const trustedCompanies = [
  "NetTax",
  "Silver Surgical Pvt Ltd",
  "I.B.L Health Care",
  "BIC MUET",
  "Click Enterprises",
  "MN Consultants",
  "MYHC Constructions",
];

export function LogoMarquee() {
  return (
    <section className="relative border-y border-secondary-300 bg-secondary-100/50 py-10">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-gray-500">
        Trusted by forward-thinking talent teams
      </p>

      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex w-max items-center gap-16 px-8 group-hover:[animation-play-state:paused]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
          whileHover={{ transition: { duration: 0 } }}
        >
          {[...trustedCompanies, ...trustedCompanies].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 whitespace-nowrap text-lg font-semibold uppercase tracking-widest text-gray-400 transition-colors hover:text-zinc-900"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}