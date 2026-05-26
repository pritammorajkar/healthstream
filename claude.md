# Bacancy Health Solution — Claude Working Instructions

## Project
Clinical Command Center Dashboard
React + TypeScript + Tailwind CSS (Vite)

## Design Reference
Always match the HealthStream dashboard design.
Primary color: #1B3F8B (dark blue)
Background: #F3F4F6 (light gray page bg)
Cards: white with light border and subtle shadow
Font: Inter or system sans-serif
Border radius: rounded-xl for cards, rounded-lg for buttons

## Folder Structure
src/
├── components/
│   ├── layout/        → AppShell, Sidebar, TopHeader
│   ├── dashboard/     → StatCard, PatientFlowFunnel, HighImpactRegistry, CareStream
│   └── common/        → Badge, Avatar, EmptyState
├── data/mockData.ts   → all dummy data lives here
├── hooks/             → useDebounce.ts
└── utils/             → hccColor.ts, geoDistance.ts

## Coding Rules
- Always use TypeScript — no 'any' types
- All components get a Props interface defined at the top
- Use Tailwind only — no inline styles, no CSS files
- All dummy/mock data goes in src/data/mockData.ts only
- One component per file
- Keep components under 150 lines — split if bigger

## HCC Score Color Logic
Above 2.0 → red (bg-red-100 text-red-700)
1.5 to 2.0 → amber (bg-amber-100 text-amber-700)
Below 1.5 → green (bg-green-100 text-green-700)

## Component Checklist
Every component must handle:
- Loading state
- Empty state (no data)
- The happy path (data exists)

## Business Context (from PRD)
This is a Population Health Management platform for clinical staff.
The logged in user is a Chief Registrar (e.g. Dr. Sarah Chen).

### Patient Journey Stages
identified → outreach → care-plan → stabilized

### Future — Trial Matching Engine (Phase 2+)
Patients will be matched to clinical trials using:
- Diagnosis + staging similarity
- Biomarker matching (EGFR, PD-L1, ALK)
- Geographic distance to trial site
This is why Patient type includes diagnosis, staging,
biomarkers and location fields even though unused now.

### Data Sources (Phase 2+)
- Internal EHR via GraphQL or REST
- ClinicalTrials.gov public API
- OncoKB / NCBI for biomarker data
- Maps API for distance calculation

## Backend (Phase 2+)
- Node.js + TypeScript + Express
- PostgreSQL database
- Prisma ORM
- Docker for containerisation
- All types defined in src/types/index.ts must match Prisma schema

### API Endpoints to Build
GET /api/dashboard/stats
GET /api/dashboard/patient-flow
GET /api/patients
GET /api/patients/:id
GET /api/care-stream