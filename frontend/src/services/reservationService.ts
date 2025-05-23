import { TrainingSession, Reservation, ReservationFormData, CancellationFormData } from '../types/reservation';

const API_URL = 'http://localhost:8000/api';

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

// Training Sessions API
export const getTrainingSessions = async (startDate?: string, endDate?: string): Promise<TrainingSession[]> => {
  let url = `${API_URL}/training-sessions`;
  if (startDate && endDate) {
    url += `?start_date=${startDate}&end_date=${endDate}`;
  }
  const response = await fetch(url, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getTrainingSession = async (id: number): Promise<TrainingSession> => {
  const response = await fetch(`${API_URL}/training-sessions/${id}`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createTrainingSession = async (data: Partial<TrainingSession>): Promise<TrainingSession> => {
  const response = await fetch(`${API_URL}/training-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateTrainingSession = async (id: number, data: Partial<TrainingSession>): Promise<TrainingSession> => {
  const response = await fetch(`${API_URL}/training-sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const deleteTrainingSession = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/training-sessions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    return handleResponse(response);
  }
};

export const cancelTrainingSession = async (id: number): Promise<any> => {
  const response = await fetch(`${API_URL}/training-sessions/${id}/cancel`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(response);
};

// Reservations API
export const getUserReservations = async (status?: string): Promise<Reservation[]> => {
  let url = `${API_URL}/reservations`;
  if (status) {
    url += `?status=${status}`;
  }
  const response = await fetch(url, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getReservation = async (id: number): Promise<Reservation> => {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createReservation = async (data: ReservationFormData): Promise<any> => {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const cancelReservation = async (id: number, data?: CancellationFormData): Promise<any> => {
  const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data || {}),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const getSessionReservations = async (sessionId: number): Promise<any> => {
  const response = await fetch(`${API_URL}/training-sessions/${sessionId}/reservations`, {
    credentials: 'include',
  });
  return handleResponse(response);
};
