import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary-100 px-4 text-center font-sans text-gray-900">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
        <Compass size={30} />
      </span>
      <h1 className="text-4xl text-gray-950">404</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
        We couldn't find the page you're looking for. It may have been moved or the link is
        incorrect.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex h-11 items-center justify-center rounded-2xl bg-primary-800 px-6 text-sm text-secondary-50 transition hover:bg-primary-900"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
