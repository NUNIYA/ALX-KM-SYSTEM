// Centralized API base URL utility.
// - In local dev: reads from VITE_API_URL env (http://localhost:5001)
// - On Vercel: VITE_API_URL should be set to '' (empty) in Vercel dashboard,
//   so requests go to relative /api/... paths on the same domain.

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5001';

export default API_BASE;
