// src/services/index.js
// Barrel export so feature code can do:
//   import { advertisementService, applicationService } from "../services";
export { default as apiClient, extractErrorMessage } from "./apiClient";
export { default as authService } from "./authService";
export { default as interviewerService } from "./interviewerService";
export { default as advertisementService } from "./advertisementService";
export { default as applicationService } from "./applicationService";
export { default as candidateService } from "./candidateService";
export { default as pipelineService } from "./pipelineService";
export { default as interviewService } from "./interviewService";
export { default as interviewerDashboardService } from "./interviewerDashboardService";
export { default as offerLetterService } from "./offerLetterService";
export { default as orgDashboardService } from "./orgDashboardService";
export { default as chatService } from "./chatService";
