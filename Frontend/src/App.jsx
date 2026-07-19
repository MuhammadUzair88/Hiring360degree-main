import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import SecondaryLayout from "./components/layout/SecondaryLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
    
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interviewer" element={<div />} />
        <Route path="/settings" element={<div />} />
        <Route path="/advertisement" element={<div />} />
      </Route>

      
      <Route element={<SecondaryLayout />}>
        <Route path="/advertisement/job/" element={<div />} />
        <Route path="/advertisement/job/candidate-intake" element={<div />} />
        <Route path="/advertisement/job/hr-round" element={<div />} />
        <Route path="/advertisement/job/technical-round" element={<div />} />
        <Route path="/advertisement/job/offer-letter" element={<div />} />
      </Route>
    </Routes>
  );
}

export default App;