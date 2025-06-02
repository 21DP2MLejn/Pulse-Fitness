// API configuration file

// Use environment variable with fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default API_URL;
