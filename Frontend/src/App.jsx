import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import SecondaryLayout from "./components/layout/SecondaryLayout";
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

function App() {
  return (
    <Routes>
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
        <Route path="/advertisement/job/:id/candidate-intake" element={<CandidateIntake />} />
        <Route path="/advertisement/job/:id/rounds" element={<Rounds />} />
        <Route path="/advertisement/job/:id/offer-letter" element={<OfferLetter />} />
        <Route
  path="/advertisement/job/:jobId/offer-letter/:applicationId/edit"
  element={<EditOfferLetter />}
/>
      </Route>
    </Routes>
  );
}

export default App;