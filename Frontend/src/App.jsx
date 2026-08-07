// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import MainLayout from "./components/layout/MainLayout";
// import SecondaryLayout from "./components/layout/SecondaryLayout";
// import Dashboard from "./pages/Dashboard";
// import Settings from "./pages/Settings";
// import Interviewer from "./pages/Interviewer";
// import Advertisement from "./pages/jobAdvertisement/mainAdvertisement/Advertisement";
// import CreateAdvertisement from "./pages/jobAdvertisement/mainAdvertisement/CreateAdvertisement";
// import JobOverviewPage from "./pages/jobAdvertisement/advertisementOverview/JobOverview";
// import EditAdvertisement from "./pages/jobAdvertisement/advertisementOverview/EditAdvertisement";
// import CandidateIntake from "./pages/jobAdvertisement/candidateIntake/CandidateIntake";
// import OfferLetter from "./pages/jobAdvertisement/offerLetter/OfferLetter";
// import Rounds from "./pages/jobAdvertisement/rounds/Rounds";
// import EditOfferLetter from "./pages/jobAdvertisement/offerLetter/EditOfferLetter";
// import CandidateForm from "./pages/CandidateForm";
// import SessionPage from "./pages/SessionPage";

// function App() {
//   return (
//     <Routes>
//       <Route path="/apply/:id" element={<CandidateForm />} />

//       {/* Full-screen live interview room - no dashboard chrome, same as the old InterviewRoom route. */}
//       <Route path="/interview/:callId" element={<SessionPage />} />

//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/interviewer" element={<Interviewer />} />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="/advertisement" element={<Advertisement />} />
//         <Route path="/advertisement/add" element={<CreateAdvertisement />} />
//       </Route>

//       <Route element={<SecondaryLayout />}>
//         <Route path="/advertisement/job/:id" element={<JobOverviewPage />} />
//         <Route path="/advertisement/edit/:id" element={<EditAdvertisement />} />
//         <Route path="/advertisement/job/:id/candidate-intake" element={<CandidateIntake />} />
//         <Route path="/advertisement/job/:id/rounds" element={<Rounds />} />
//         <Route path="/advertisement/job/:id/offer-letter" element={<OfferLetter />} />
//         <Route path="/advertisement/job/:jobId/offer-letter/:applicationId/edit" element={<EditOfferLetter />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;


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
<<<<<<< HEAD
import CandidateForm from "./components/organization/candidateForm/CandidateForm";
=======
import CandidateForm from "./pages/CandidateForm";
import SessionPage from "./pages/SessionPage";
import InterviewerDashboard from "./pages/interviewer/dashboard/InterviewerDashboard";
import ConductInterviews from "./pages/interviewer/conductInterviews/ConductInterviews";
import Evaluation from "./pages/interviewer/evaluation/Evaluation";
import CandidateDetails from "./pages/interviewer/conductInterviews/CandidateDetails";
import CandidateEvaluation from "./pages/interviewer/evaluation/CandidateEvaluation";


>>>>>>> c6be653973e4603d62d26f5d2dfacba3d09ab668

function App() {
  return (
    <Routes>
      <Route path="/apply/:id" element={<CandidateForm />} />

      {/* Full-screen live interview room - no dashboard chrome, same as the old InterviewRoom route. */}
      <Route path="/interview/:callId" element={<SessionPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/advertisement" element={<Advertisement />} />
        <Route path="/advertisement/add" element={<CreateAdvertisement />} />
      </Route>

      <Route element={<SecondaryLayout />}>
        <Route path="/advertisement/job/:id" element={<JobOverviewPage />} />
        <Route path="/advertisement/edit/:id" element={<EditAdvertisement />} />
<<<<<<< HEAD
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
          path="/advertisement/job/:jobId/offer-letter/:applicationId/edit"
          element={<EditOfferLetter />}
        />
=======
        <Route path="/advertisement/job/:id/candidate-intake" element={<CandidateIntake />} />
        <Route path="/advertisement/job/:id/rounds" element={<Rounds />} />
        <Route path="/advertisement/job/:id/offer-letter" element={<OfferLetter />} />
        <Route path="/advertisement/job/:jobId/offer-letter/:applicationId/edit" element={<EditOfferLetter />} />
      </Route>

      {/* Dedicated Interviewer Workspace — plural "/interviewers" so it never
          collides with the org-side "/interviewer" management page above.
          No auth guard yet, matching the rest of this file; when auth comes
          back (see old app.jsx's isInterviewerLogin check) this is the Route
          to wrap with it. */}
      <Route path="/interviewers" element={<InterviewerLayout />}>
        {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
        <Route path="/interviewers/dashboard" element={<InterviewerDashboard />} />
        <Route path="/interviewers/conduct-interviews" element={<ConductInterviews />} />
        <Route path="/interviewers/conduct-interviews/:id" element={<CandidateDetails />} />
        <Route path="/interviewers/evaluation" element={<Evaluation />} />
        <Route path="/interviewers/evaluation/:id" element={<CandidateEvaluation />} />

        {/* <Route path="conduct" element={<ConductInterviews />} />
        <Route path="conduct/:id" element={<CandidateDetailsPage />} />
        <Route path="evaluation" element={<Evaluation />} />
        <Route path="evaluation/:id" element={<CandidateEvaluation />} /> */}
>>>>>>> c6be653973e4603d62d26f5d2dfacba3d09ab668
      </Route>
    </Routes>
  );
}

export default App;
