import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import SecondaryLayout from "./components/layout/SecondaryLayout";
import InterviewerLayout from "./components/layout/InterviewerLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Interviewer from "./pages/Interviewer";
import Advertisement from "./pages/jobAdvertisement/mainAdvertisement/Advertisement";
import CreateAdvertisement from "./pages/jobAdvertisement/mainAdvertisement/CreateAdvertisement";
import JobOverviewPage from "./pages/jobAdvertisement/advertisementOverview/JobOverview";
import EditAdvertisement from "./pages/jobAdvertisement/advertisementOverview/EditAdvertisement";
import CandidateIntake from "./pages/jobAdvertisement/candidateIntake/CandidateIntake";
import OfferLetter from "./pages/jobAdvertisement/offerLetter/OfferLetter";
import Rounds from "./pages/jobAdvertisement/rounds/Rounds";
import EditOfferLetter from "./pages/jobAdvertisement/offerLetter/EditOfferLetter";

import CandidateForm from "./pages/CandidateForm";
import SessionPage from "./pages/SessionPage";
import InterviewerDashboard from "./pages/interviewer/dashboard/InterviewerDashboard";
import ConductInterviews from "./pages/interviewer/conductInterviews/ConductInterviews";
import Evaluation from "./pages/interviewer/evaluation/Evaluation";
import CandidateDetails from "./pages/interviewer/conductInterviews/CandidateDetails";
import CandidateEvaluation from "./pages/interviewer/evaluation/CandidateEvaluation";
import InterviewerLogin from "./pages/interviewer/auth/InterviewerLogin";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/landingPage/LandingPage";

import {
  OrganizationRoute,
  InterviewerRoute,
  GuestOnlyRoute,
  InterviewerGuestOnlyRoute,
} from "./components/routing/ProtectedRoute";
import Login from "./pages/Login";
import SocialAccountManager from "./pages/connectSocials/SocialAccountManager";
import SocialConnectCallback from "./pages/connectSocials/SocialConnectCallback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* ───────────────────── Organization auth (guest only) ───────────────────── */}
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        }
      />

      {/* ───────────────────── Interviewer auth (guest only) ───────────────────── */}
      <Route
        path="/interviewers/login"
        element={
          <InterviewerGuestOnlyRoute>
            <InterviewerLogin />
          </InterviewerGuestOnlyRoute>
        }
      />

      {/* ───────────────────── Fully public routes ───────────────────── */}
      <Route path="/apply/:id" element={<CandidateForm />} />

      {/* Full-screen live interview room — no dashboard chrome. Reachable by
          both candidates (no account) and interviewers/organizations. */}
      <Route path="/interview/:callId" element={<SessionPage />} />

      {/* ───────────────────── Organization workspace (protected) ───────────────────── */}
      <Route element={<OrganizationRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interviewer" element={<Interviewer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/advertisement" element={<Advertisement />} />
          <Route path="/advertisement/add" element={<CreateAdvertisement />} />
          <Route path="/connect-account" element={<SocialAccountManager />} />

          <Route
            path="/organization/social"
            element={<SocialConnectCallback />}
          />
        </Route>

        <Route element={<SecondaryLayout />}>
          <Route path="/advertisement/job/:id" element={<JobOverviewPage />} />
          <Route
            path="/advertisement/edit/:id"
            element={<EditAdvertisement />}
          />
          <Route
            path="/advertisement/job/:id/candidate-intake"
            element={<CandidateIntake />}
          />
          <Route path="/advertisement/job/:id/rounds" element={<Rounds />} />
          <Route
            path="/advertisement/job/:id/offer-letter"
            element={<OfferLetter />}
          />
          <Route
            path="/advertisement/job/:id/offer-letter/:applicationId/edit"
            element={<EditOfferLetter />}
          />
        </Route>
      </Route>

      {/* ───────────────────── Interviewer workspace (protected) ─────────────────────
          "/interviewers" (plural) so it never collides with the org-side
          "/interviewer" management page above. */}
      <Route element={<InterviewerRoute />}>
        <Route path="/interviewers" element={<InterviewerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InterviewerDashboard />} />
          <Route path="conduct-interviews" element={<ConductInterviews />} />
          <Route path="conduct-interviews/:id" element={<CandidateDetails />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="evaluation/:id" element={<CandidateEvaluation />} />
        </Route>
      </Route>

      {/* ───────────────────── 404 ───────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
