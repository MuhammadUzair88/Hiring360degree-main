// src/components/interviewerDashboard/conductInterview/candidateDetailsData.js
//
// Dummy data for the Candidate Details page, one record per scheduleId
// from data.js's `interviews` list — so clicking any roster card opens
// a matching profile. When the backend is wired up, this file's shape
// is exactly what CandidateDetails.jsx should expect back from
// `GET /api/interviewer/dash/candidates/:id`; only that page needs to
// change, every component in this folder keeps working as-is.

export const candidateDetails = {
  sch_1001: {
    scheduleId: "sch_1001",
    candidateName: "Sumit Sharma",
    email: "sumit.sharma@example.com",
    phone: "+92 300 1234567",
    status: "Completed",
    assignedStage: "Technical Round",
    roundIndex: 2,
    totalRounds: 3,
    interviewDate: "2026-07-14",
    interviewTime: "10:00",
    meetingLink: null,
    feedbackEvaluation: "Completed",
    jobTitleTarget: "Senior Frontend Developer",
    departmentPool: "Engineering",
    employmentType: "Full-Time",
    workMode: "Remote",
    experienceRequired: "6+ years experience required",
    requiredSkills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
    jobDescription:
      "We're looking for a senior frontend developer to lead the UI architecture for our candidate-facing products, mentor mid-level engineers, and drive component quality across the design system.",
    resume: {
      location: "Karachi, PK",
      linkedin: "linkedin.com/in/sumitsharma",
      github: "github.com/sumit-dev",
      experience: [
        {
          title: "Staff Frontend Engineer",
          company: "CloudScale Inc.",
          period: "2019 - Present",
          bullets: [
            "Architected a micro-frontend setup using React and Module Federation.",
            "Reduced CI/CD pipeline duration by 45% through aggressive caching.",
            "Led a team of 8 engineers migrating a legacy monolith to Next.js.",
          ],
        },
        {
          title: "Frontend Developer",
          company: "FinTech Solutions",
          period: "2016 - 2019",
          bullets: [
            "Built high-frequency trading dashboards with sub-50ms render latency.",
            "Implemented OAuth2 / OpenID Connect authentication flows.",
          ],
        },
      ],
      projects: [
        {
          title: "Open Source Contributor — React Query",
          description: "Maintained core documentation and optimized hydration logic for SSR.",
        },
      ],
      skills: ["TypeScript", "React / Next.js", "Node.js", "PostgreSQL", "AWS (Lambda/RDS)", "Docker/K8s", "GraphQL"],
      education: { degree: "B.S. Computer Science", school: "NED University of Engineering", period: "2012 - 2016" },
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Urdu", level: "Native" },
      ],
    },
    previousFeedbacks: [
      {
        round: "HR Round",
        interviewer: "Fatima Noor",
        rating: "4.5",
        recommendation: "Hire",
        remarks: "Strong communicator, clear about career goals and comp expectations.",
      },
    ],
  },

  sch_1002: {
    scheduleId: "sch_1002",
    candidateName: "Ayesha Baig",
    email: "ayesha.baig@example.com",
    phone: "+92 301 2345678",
    status: "Upcoming",
    assignedStage: "Portfolio Review",
    roundIndex: 0,
    totalRounds: 3,
    interviewDate: "2026-08-10",
    interviewTime: "14:30",
    meetingLink: "https://meet.example.com/portfolio-review",
    feedbackEvaluation: "Pending",
    jobTitleTarget: "Product Designer",
    departmentPool: "Design",
    employmentType: "Full-Time",
    workMode: "Hybrid",
    experienceRequired: "4+ years experience required",
    requiredSkills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    jobDescription:
      "Own end-to-end product design for the interviewer and candidate experiences — from research through polished, developer-ready designs.",
    resume: {
      location: "Hyderabad, PK",
      linkedin: "linkedin.com/in/ayeshabaig",
      github: null,
      experience: [
        {
          title: "Product Designer",
          company: "Pixel Forge Studio",
          period: "2021 - Present",
          bullets: [
            "Designed and shipped the current design system used across 12 product surfaces.",
            "Ran monthly usability studies that shaped the onboarding redesign.",
          ],
        },
        {
          title: "UI Designer",
          company: "Nimbus Apps",
          period: "2018 - 2021",
          bullets: ["Delivered mobile-first UI kits for 3 shipped consumer apps."],
        },
      ],
      projects: [
        { title: "Design System — Hiring360", description: "Built the component library and tokens now used across the interviewer dashboard." },
      ],
      skills: ["Figma", "Framer", "Design Tokens", "User Research", "Accessibility (WCAG)"],
      education: { degree: "B.Des Visual Communication", school: "Indus Valley School of Art", period: "2014 - 2018" },
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Urdu", level: "Native" },
      ],
    },
    previousFeedbacks: [],
  },

  sch_1003: {
    scheduleId: "sch_1003",
    candidateName: "Hassan Raza",
    email: "hassan.raza@example.com",
    phone: "+92 302 3456789",
    status: "Ongoing",
    assignedStage: "Technical Round",
    roundIndex: 1,
    totalRounds: 3,
    interviewDate: "2026-08-06",
    interviewTime: "11:00",
    meetingLink: "https://meet.example.com/system-design",
    feedbackEvaluation: "Pending",
    jobTitleTarget: "Backend Engineer",
    departmentPool: "Engineering",
    employmentType: "Full-Time",
    workMode: "Remote",
    experienceRequired: "5+ years experience required",
    requiredSkills: ["Node.js", "PostgreSQL", "System Design", "AWS"],
    jobDescription:
      "Design and own backend services powering the scheduling and evaluation pipeline, with a focus on reliability at scale.",
    resume: {
      location: "Hyderabad, PK",
      linkedin: "linkedin.com/in/hassanraza",
      github: "github.com/hraza-dev",
      experience: [
        {
          title: "Senior Backend Engineer",
          company: "Vertex Systems",
          period: "2020 - Present",
          bullets: [
            "Designed a multi-tenant scheduling service handling 40k+ daily bookings.",
            "Cut average API latency by 60% via query optimization and read replicas.",
          ],
        },
        {
          title: "Backend Developer",
          company: "DataForge Labs",
          period: "2017 - 2020",
          bullets: ["Built the core billing and invoicing microservice."],
        },
      ],
      projects: [
        { title: "Internal Rate Limiter Library", description: "Open-sourced a token-bucket rate limiter now used across 6 internal services." },
      ],
      skills: ["Node.js", "PostgreSQL", "Redis", "AWS (ECS/RDS)", "System Design", "Kafka"],
      education: { degree: "B.E. Software Engineering", school: "Mehran University", period: "2013 - 2017" },
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Urdu", level: "Native" },
      ],
    },
    previousFeedbacks: [
      {
        round: "Screening",
        interviewer: "Zubair Ahmed",
        rating: "4.2",
        recommendation: "Hire",
        remarks: "Solid fundamentals, explained trade-offs clearly under time pressure.",
      },
    ],
  },

  sch_1004: {
    scheduleId: "sch_1004",
    candidateName: "Mahnoor Khan",
    email: "mahnoor.khan@example.com",
    phone: "+92 303 4567890",
    status: "Upcoming",
    assignedStage: "HR Round",
    roundIndex: 0,
    totalRounds: 2,
    interviewDate: "2026-08-12",
    interviewTime: "09:30",
    meetingLink: "https://meet.example.com/hr-round",
    feedbackEvaluation: "Pending",
    jobTitleTarget: "QA Engineer",
    departmentPool: "Engineering",
    employmentType: "Full-Time",
    workMode: "On-site",
    experienceRequired: "3+ years experience required",
    requiredSkills: ["Manual Testing", "Cypress", "API Testing", "Test Planning"],
    jobDescription: "Own quality across the interviewer and candidate-facing products, from test planning through automated regression coverage.",
    resume: {
      location: "Hyderabad, PK",
      linkedin: "linkedin.com/in/mahnoorkhan",
      github: "github.com/mahnoor-qa",
      experience: [
        {
          title: "QA Engineer",
          company: "Brightlane Software",
          period: "2022 - Present",
          bullets: ["Built the Cypress regression suite covering 85% of critical user flows."],
        },
        {
          title: "QA Associate",
          company: "Appsential",
          period: "2020 - 2022",
          bullets: ["Owned manual test planning for two mobile app releases per quarter."],
        },
      ],
      projects: [],
      skills: ["Cypress", "Postman", "Manual Testing", "Test Planning", "JIRA"],
      education: { degree: "B.S. Software Engineering", school: "QUEST Nawabshah", period: "2016 - 2020" },
      languages: [{ name: "English", level: "Fluent" }, { name: "Urdu", level: "Native" }],
    },
    previousFeedbacks: [],
  },

  sch_1005: {
    scheduleId: "sch_1005",
    candidateName: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    phone: "+92 304 5678901",
    status: "Completed",
    assignedStage: "Technical Round",
    roundIndex: 1,
    totalRounds: 2,
    interviewDate: "2026-08-01",
    interviewTime: "16:00",
    meetingLink: null,
    feedbackEvaluation: "Pending",
    jobTitleTarget: "DevOps Engineer",
    departmentPool: "Infrastructure",
    employmentType: "Full-Time",
    workMode: "Remote",
    experienceRequired: "5+ years experience required",
    requiredSkills: ["Kubernetes", "Terraform", "CI/CD", "AWS"],
    jobDescription: "Own the deployment pipeline and infrastructure-as-code for every environment, from staging through production.",
    resume: {
      location: "Karachi, PK",
      linkedin: "linkedin.com/in/bilalahmed",
      github: "github.com/bilal-ops",
      experience: [
        {
          title: "DevOps Engineer",
          company: "Skyline Cloud",
          period: "2019 - Present",
          bullets: [
            "Migrated infrastructure to Terraform, cutting environment provisioning from days to minutes.",
            "Built the blue/green deployment pipeline used across 20+ services.",
          ],
        },
      ],
      projects: [{ title: "Internal Terraform Module Registry", description: "Standardized reusable modules used by every service team." }],
      skills: ["Kubernetes", "Terraform", "AWS", "GitHub Actions", "Prometheus/Grafana"],
      education: { degree: "B.S. Computer Science", school: "FAST-NUCES Karachi", period: "2013 - 2017" },
      languages: [{ name: "English", level: "Fluent" }, { name: "Urdu", level: "Native" }],
    },
    previousFeedbacks: [
      {
        round: "Screening",
        interviewer: "Nida Farooq",
        rating: "4.0",
        recommendation: "Hire",
        remarks: "Deep infra knowledge, good instincts on cost trade-offs.",
      },
    ],
  },

  sch_1006: {
    scheduleId: "sch_1006",
    candidateName: "Zara Iqbal",
    email: "zara.iqbal@example.com",
    phone: "+92 305 6789012",
    status: "No Show",
    assignedStage: "Screening",
    roundIndex: 0,
    totalRounds: 3,
    interviewDate: "2026-07-28",
    interviewTime: "13:00",
    meetingLink: null,
    feedbackEvaluation: "Pending",
    jobTitleTarget: "Marketing Associate",
    departmentPool: "Marketing",
    employmentType: "Full-Time",
    workMode: "On-site",
    experienceRequired: "2+ years experience required",
    requiredSkills: ["Content Strategy", "SEO", "Campaign Analytics"],
    jobDescription: "Support campaign planning and content strategy across the marketing calendar.",
    resume: {
      location: "Hyderabad, PK",
      linkedin: "linkedin.com/in/zaraiqbal",
      github: null,
      experience: [
        {
          title: "Marketing Coordinator",
          company: "Northstar Media",
          period: "2022 - Present",
          bullets: ["Ran the quarterly content calendar across 4 channels."],
        },
      ],
      projects: [],
      skills: ["SEO", "Content Strategy", "Google Analytics", "Canva"],
      education: { degree: "BBA Marketing", school: "University of Sindh", period: "2018 - 2022" },
      languages: [{ name: "English", level: "Fluent" }, { name: "Urdu", level: "Native" }],
    },
    previousFeedbacks: [],
  },
};

/** Looks up a candidate detail record by scheduleId (the route :id param). */
export function getCandidateDetails(scheduleId) {
  return candidateDetails[scheduleId] || null;
}