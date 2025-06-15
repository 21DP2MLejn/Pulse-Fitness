import { TrainingSession, Reservation, ReservationFormData, CancellationFormData } from '../types/reservation';
import Cookies from 'js-cookie';
import { API_URL } from '../config/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    } else {
      throw new Error('An error occurred with the API request');
    }
  }
  return response.json();
};

// Get auth token
const getAuthToken = (): string => {
  // Try to get token from cookies first
  const cookieToken = Cookies.get('token');
  if (cookieToken) {
    return cookieToken;
  }
  
  // If not in cookies, try localStorage with the correct key
  const localToken = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
  if (localToken) {
    // If found in localStorage but not in cookie, restore the cookie
    console.log("Token found in localStorage but not in cookie, restoring cookie");
    Cookies.set("token", localToken, { 
      expires: 7,
      path: '/',
      sameSite: 'lax'
    });
    return localToken;
  }
  
  throw new Error('Authentication token is missing. Please log in again.');
};

// Training Sessions API
export const getTrainingSessions = async (startDate?: string, endDate?: string, forceFresh?: boolean): Promise<TrainingSession[]> => {
  const token = getAuthToken();
  console.log('[getTrainingSessions] Using token:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN');
  
  let url = `${API_URL}/training-sessions`;
  if (startDate && endDate) {
    url += `?start_date=${startDate}&end_date=${endDate}`;
  }
  
  // Add cache-busting parameter to ensure fresh data
  if (forceFresh) {
    const cacheBuster = Date.now();
    url += url.includes('?') ? `&_=${cacheBuster}` : `?_=${cacheBuster}`;
  }
  
  console.log('[getTrainingSessions] Fetching from:', url);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    },
    credentials: 'include',
  });
  
  console.log('[getTrainingSessions] Response status:', response.status);
  
  const data = await handleResponse(response);
  console.log('[getTrainingSessions] Received sessions:', data.length, 'First session user_has_reservation:', data[0]?.user_has_reservation);
  
  return data;
};

export const getTrainingSession = async (id: number): Promise<TrainingSession> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/training-sessions/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

// Reservations API
export const getUserReservations = async (status?: string): Promise<Reservation[]> => {
  const token = getAuthToken();

  let url = `${API_URL}/reservations`;
  if (status) {
    url += `?status=${status}`;
  }
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createReservation = async (data: ReservationFormData): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  return handleResponse(response);
};

export const cancelReservation = async (id: number, options?: { reason?: string }): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      reason: options?.reason || ''
    }),
    credentials: 'include',
  });
  
  return handleResponse(response);
};

// Admin functions
export const createTrainingSession = async (data: Partial<TrainingSession>): Promise<TrainingSession> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/training-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateTrainingSession = async (id: number, data: Partial<TrainingSession>): Promise<TrainingSession> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/training-sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const deleteTrainingSession = async (id: number): Promise<void> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/training-sessions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const cancelTrainingSession = async (id: number): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/training-sessions/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getSessionReservations = async (sessionId: number): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/training-sessions/${sessionId}/reservations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  return handleResponse(response);
};
