// API service layer
// All HTTP requests to the backend go through this file

import { API_BASE_URL as BASE_URL } from '../utils/imageUrl';

// Fetch hotels with optional search, price filters and pagination
export async function fetchHotels({ search = '', minPrice = '', maxPrice = '', page = 1, limit = 5 } = {}) {
  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  params.append('page', page);
  params.append('limit', limit);

  const response = await fetch(`${BASE_URL}/hotels?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch hotels.');
  }

  return response.json();
}

// Fetch a single hotel by ID
export async function fetchHotelById(id) {
  const response = await fetch(`${BASE_URL}/hotels/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch hotel details.');
  }

  return response.json();
}

// Create a new hotel (sends FormData because of image upload)
export async function createHotel(formData) {
  const response = await fetch(`${BASE_URL}/hotels`, {
    method: 'POST',
    body: formData, // Do NOT set Content-Type header; let the browser set it for FormData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create hotel.');
  }

  return response.json();
}

// Update an existing hotel by ID
export async function updateHotel(id, formData) {
  const response = await fetch(`${BASE_URL}/hotels/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update hotel.');
  }

  return response.json();
}

// Delete a hotel by ID
export async function deleteHotel(id) {
  const response = await fetch(`${BASE_URL}/hotels/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete hotel.');
  }

  return response.json();
}

