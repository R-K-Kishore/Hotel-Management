// Utility for backend URL and image path resolution

export const BACKEND_URL = 'http://localhost:4000';
export const API_BASE_URL = `${BACKEND_URL}/api`;
export const FALLBACK_IMAGE = 'https://via.placeholder.com/800x400?text=No+Image';

/**
 * Builds the full URL for a hotel image.
 * - Returns a fallback placeholder if imagePath is empty.
 * - Returns the path as is if it already starts with http/https.
 * - Prepends BACKEND_URL for local backend-served images (e.g. uploads/filename.jpg).
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return FALLBACK_IMAGE;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${BACKEND_URL}/${imagePath}`;
}

