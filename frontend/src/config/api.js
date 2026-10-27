// Single base address for the SKYNZ prototype API.
// Backend uses 3000; the React development server may use 3001.
export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');
