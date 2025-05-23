'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserReservations, cancelReservation } from '@/services/reservationService';
import { Reservation } from '@/types/reservation';

export default function MyReservationsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  // State
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Fetch user's reservations
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const reservations = await getUserReservations();
      
      // Split into active and past reservations
      const now = new Date();
      const active: Reservation[] = [];
      const past: Reservation[] = [];
      
      reservations.forEach(reservation => {
        if (!reservation.trainingSession) return;
        
        const sessionEndTime = parseISO(reservation.trainingSession.end_time);
        
        // Skip cancelled reservations for active list
        if (reservation.cancelled) {
          past.push(reservation);
        } else if (sessionEndTime < now) {
          past.push(reservation);
        } else {
          active.push(reservation);
        }
      });
      
      // Sort by start time
      active.sort((a, b) => {
        return new Date(a.trainingSession!.start_time).getTime() - 
               new Date(b.trainingSession!.start_time).getTime();
      });
      
      past.sort((a, b) => {
        return new Date(b.trainingSession!.start_time).getTime() - 
               new Date(a.trainingSession!.start_time).getTime();
      });
      
      setActiveReservations(active);
      setPastReservations(past);
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      setError(err.message || 'Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login?redirect=/reservations/my-reservations');
        return;
      }
      
      fetchReservations();
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Cancel reservation
  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCancelReason('');
    setShowCancelModal(true);
  };
  
  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cancelReservation(selectedReservation.id, { reason: cancelReason });
      
      // Show success message
      setSuccessMessage('Reservation cancelled successfully.');
      
      // Close modal
      setShowCancelModal(false);
      
      // Refresh reservations
      await fetchReservations();
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      setError(err.message || 'Failed to cancel reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render functions
  const renderReservationCard = (reservation: Reservation, isActive: boolean) => {
    if (!reservation.trainingSession) return null;
    
    const session = reservation.trainingSession;
    const startTime = format(parseISO(session.start_time), 'h:mm a');
    const endTime = format(parseISO(session.end_time), 'h:mm a');
    const date = format(parseISO(session.start_time), 'EEEE, MMMM d, yyyy');
    
    return (
      <div 
        key={reservation.id} 
        className={`p-4 mb-4 rounded-lg shadow ${
          isDark 
            ? (reservation.cancelled ? 'bg-gray-700 opacity-50' : 'bg-gray-800') 
            : (reservation.cancelled ? 'bg-gray-100 opacity-50' : 'bg-white')
        }`}
      >
        {reservation.cancelled && (
          <div className="mb-2 text-red-500 font-bold flex items-center">
            <FiAlertCircle className="mr-1" />
            Cancelled {reservation.cancellation_reason && `- Reason: ${reservation.cancellation_reason}`}
          </div>
        )}
        
        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {session.title}
        </h3>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm">
            <FiCalendar className="mr-2" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <FiClock className="mr-2" />
            <span>{startTime} - {endTime}</span>
          </div>
          
          {session.location && (
            <div className="flex items-center text-sm">
              <FiMapPin className="mr-2" />
              <span>{session.location}</span>
            </div>
          )}
          
          {session.trainer_name && (
            <div className="flex items-center text-sm">
              <FiUser className="mr-2" />
              <span>Trainer: {session.trainer_name}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <FiCheckCircle className="mr-2" />
            <span>Reserved on: {format(parseISO(reservation.reserved_at), 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>
        
        {isActive && !reservation.cancelled && (
          <div className="mt-3">
            <button
              onClick={() => openCancelModal(reservation)}
              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Cancel Reservation
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const renderCancelModal = () => {
    if (!selectedReservation || !selectedReservation.trainingSession) return null;
    
    const session = selectedReservation.trainingSession;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-lg p-6 max-w-md w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Cancel Reservation</h2>
          
          <div className="mb-4">
            <p><strong>Session:</strong> {session.title}</p>
            <p><strong>Date:</strong> {format(parseISO(session.start_time), 'EEEE, MMMM d, yyyy')}</p>
            <p><strong>Time:</strong> {format(parseISO(session.start_time), 'h:mm a')} - {format(parseISO(session.end_time), 'h:mm a')}</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Reason for cancellation (optional)</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Please provide a reason for cancelling this reservation"
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className={`px-4 py-2 rounded ${
                isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Keep Reservation
            </button>
            
            <button
              onClick={handleCancelReservation}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Reservations</h1>
          
          <button
            onClick={() => router.push('/reservations')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Book New Session
          </button>
        </div>
        
        {/* Alerts */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
            <button 
              className="float-right font-bold"
              onClick={() => setSuccessMessage(null)}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Loading state */}
        {loading && !activeReservations.length && !pastReservations.length ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4">Loading your reservations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active reservations */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Upcoming Reservations</h2>
              
              {activeReservations.length === 0 ? (
                <div className={`p-6 rounded-lg shadow text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <p className="text-gray-500">You don't have any upcoming reservations.</p>
                  <button
                    onClick={() => router.push('/reservations')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Book a Training Session
                  </button>
                </div>
              ) : (
                activeReservations.map(reservation => renderReservationCard(reservation, true))
              )}
            </div>
            
            {/* Past reservations */}
            <div>
              <h2 className="text-xl font-bold mb-4">Past & Cancelled Reservations</h2>
              
              {pastReservations.length === 0 ? (
                <div className={`p-6 rounded-lg shadow text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <p className="text-gray-500">No past or cancelled reservations.</p>
                </div>
              ) : (
                pastReservations.map(reservation => renderReservationCard(reservation, false))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Cancel modal */}
      {showCancelModal && renderCancelModal()}
    </div>
  );
}
