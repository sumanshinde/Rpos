
export const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Helper to build API URLs with proper trailing slash handling.
 * Django strictly requires trailing slashes by default.
 */
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // Ensure trailing slash if not present (and not carrying query params)
    let finalEndpoint = cleanEndpoint;
    if (!cleanEndpoint.endsWith('/') && !cleanEndpoint.includes('?')) {
        finalEndpoint = `${cleanEndpoint}/`;
    }

    return `${API_BASE_URL}/${finalEndpoint}`;
};
