// Phase 2: Express server entry point
// Endpoints to implement (see CLAUDE.md §API Endpoints):
//   GET /api/dashboard/stats
//   GET /api/dashboard/patient-flow
//   GET /api/patients
//   GET /api/patients/:id
//   GET /api/care-stream

import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
