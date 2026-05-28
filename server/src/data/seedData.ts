// Prisma seed input — ready to use with `prisma db seed` once the database is set up.
// Wire this into prisma/seed.ts when you run `npx prisma migrate dev`.

export const seedPatients = [
  {
    id: 'p-001',
    initials: 'RJ',
    firstName: 'Robert',
    lastName: 'Johnson',
    dob: '05/12/1954',
    hccScore: 2.45,
    primaryConcern: 'CHF Exacerbation Risk',
    status: 'outreach' as const,
    risk: 'high' as const,
    diagnosis: 'Congestive Heart Failure',
    staging: 'Stage III',
    biomarkers: {
      create: [
        { name: 'BNP', value: '1420 pg/mL', type: 'expression' as const },
        { name: 'eGFR', value: '42 mL/min', type: 'flag' as const },
      ],
    },
    location: {
      create: { zip: '30301', lat: 33.749, lng: -84.388 },
    },
  },
  {
    id: 'p-002',
    initials: 'MS',
    firstName: 'Maria',
    lastName: 'Santos',
    dob: '11/22/1962',
    hccScore: 1.82,
    primaryConcern: 'HbA1c > 9.0',
    status: 'care_plan' as const,
    risk: 'medium' as const,
    diagnosis: 'Type 2 Diabetes Mellitus',
    staging: null,
    biomarkers: {
      create: [
        { name: 'HbA1c', value: '9.4%', type: 'expression' as const },
        { name: 'eGFR', value: '61 mL/min', type: 'flag' as const },
      ],
    },
    location: {
      create: { zip: '90210', lat: 34.0901, lng: -118.4065 },
    },
  },
  {
    id: 'p-003',
    initials: 'DW',
    firstName: 'David',
    lastName: 'Washington',
    dob: '03/08/1948',
    hccScore: 3.12,
    primaryConcern: 'COPD Exacerbation',
    status: 'identified' as const,
    risk: 'high' as const,
    diagnosis: 'Chronic Obstructive Pulmonary Disease',
    staging: 'GOLD III',
    biomarkers: {
      create: [
        { name: 'FEV1', value: '38% predicted', type: 'expression' as const },
        { name: 'SpO2', value: '91%', type: 'flag' as const },
      ],
    },
    location: {
      create: { zip: '60601', lat: 41.8827, lng: -87.6233 },
    },
  },
  {
    id: 'p-004',
    initials: 'LT',
    firstName: 'Linda',
    lastName: 'Thompson',
    dob: '07/30/1958',
    hccScore: 1.34,
    primaryConcern: 'Hypertension Management',
    status: 'stabilized' as const,
    risk: 'low' as const,
    diagnosis: 'Essential Hypertension',
    staging: null,
    biomarkers: {
      create: [
        { name: 'BP', value: '142/88 mmHg', type: 'flag' as const },
        { name: 'LDL', value: '118 mg/dL', type: 'expression' as const },
      ],
    },
    location: {
      create: { zip: '77001', lat: 29.7604, lng: -95.3698 },
    },
  },
  {
    id: 'p-005',
    initials: 'JR',
    firstName: 'James',
    lastName: 'Rivera',
    dob: '09/14/1965',
    hccScore: 2.08,
    primaryConcern: 'CKD Stage 3b Monitoring',
    status: 'outreach' as const,
    risk: 'high' as const,
    diagnosis: 'Chronic Kidney Disease',
    staging: 'Stage 3b',
    biomarkers: {
      create: [
        { name: 'eGFR', value: '32 mL/min', type: 'flag' as const },
        { name: 'Creatinine', value: '2.1 mg/dL', type: 'expression' as const },
        { name: 'UACR', value: '285 mg/g', type: 'expression' as const },
      ],
    },
    location: {
      create: { zip: '10001', lat: 40.7484, lng: -73.9967 },
    },
  },
]

export const seedCareStreamEvents = [
  {
    id: 'evt-001',
    type: 'success' as const,
    title: 'Robert Miller Stabilized',
    description: 'Transitioned from High Risk to Managed Care cohort.',
    timestamp: '10:24 AM',
  },
  {
    id: 'evt-002',
    type: 'critical' as const,
    title: 'Post-Discharge Call',
    description: 'Alice Green due for 24-hour follow-up call.',
    timestamp: '9:15 AM',
  },
  {
    id: 'evt-003',
    type: 'info' as const,
    title: 'Care Plan Updated',
    description: "James Rivera's CKD care plan revised by Dr. Patel.",
    timestamp: '8:47 AM',
    patientId: 'p-005',
  },
  {
    id: 'evt-004',
    type: 'success' as const,
    title: 'Gap Closed — Mammogram',
    description: 'Linda Thompson completed annual screening. Gap resolved.',
    timestamp: '8:02 AM',
    patientId: 'p-004',
  },
]

// Example prisma/seed.ts usage:
//
// import { PrismaClient } from '@prisma/client'
// import { seedPatients, seedCareStreamEvents } from '../src/data/seedData'
//
// const prisma = new PrismaClient()
//
// async function main() {
//   for (const patient of seedPatients) {
//     await prisma.patient.create({ data: patient })
//   }
//   for (const event of seedCareStreamEvents) {
//     await prisma.careStreamEvent.create({ data: event })
//   }
// }
//
// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect())
