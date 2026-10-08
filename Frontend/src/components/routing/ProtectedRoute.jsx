// src/components/routing/ProtectedRoute.jsx
//
// Two guards, one per role, used to wrap layout routes in App.jsx:
//   <OrganizationRoute />  -> redirects to /login when no org session
//   <InterviewerRoute />   -> redirects to /interviewers/login when no
//                             interviewer session
//
// Both render an <Outlet /> so they can wrap a whole nested route tree.
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function FullScreenLoader({ label = "Loading application..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export function OrganizationRoute() {
  const { isLoggedIn, isOrgLoading } = useAuth();
  const location = useLocation();

  if (isOrgLoading) return <FullScreenLoader />;
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function InterviewerRoute() {
  const { isInterviewerLogin, isInterviewerLoading } = useAuth();
  const location = useLocation();

  if (isInterviewerLoading) return <FullScreenLoader />;
  if (!isInterviewerLogin) {
    return <Navigate to="/interviewers/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function GuestOnlyRoute({ children, redirectTo = "/dashboard" }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to={redirectTo} replace />;
  return children;
}

export function InterviewerGuestOnlyRoute({ children, redirectTo = "/interviewers/dashboard" }) {
  const { isInterviewerLogin } = useAuth();
  if (isInterviewerLogin) return <Navigate to={redirectTo} replace />;
  return children;
}

export default FullScreenLoader;
