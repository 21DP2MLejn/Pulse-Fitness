'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays, startOfWeek, endOfWeek, parseISO, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiMapPin, FiUser, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTrainingSessions, createReservation, cancelReservation } from '@/services/reservationService';
import { TrainingSession, DaySchedule, WeekSchedule } from '@/types/reservation';

export default function ReservationsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  // State for week navigation
  const [currentWeek, setCurrentWeek] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }), // Start on Monday
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  
  // State for sessions data
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State for modal
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  
  // Fetch sessions for the current week
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const startDateStr = format(currentWeek.startDate, 'yyyy-MM-dd');
      const endDateStr = format(currentWeek.endDate, 'yyyy-MM-dd');
      
      const sessions = await getTrainingSessions(startDateStr, endDateStr);
      
      // Organize sessions by day
      const days: WeekSchedule = [];
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentWeek.startDate, i);
        const daySessions = sessions.filter(session => 
          isSameDay(parseISO(session.start_time), date)
        );
        
        days.push({
          date,
          sessions: daySessions,
        });
      }
      
      setWeekSchedule(days);
    } catch (err) {
      console.error('Error fetching training sessions:', err);
      setError('Failed to load training schedule. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentWeek]);
  
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login?redirect=/reservations');
        return;
      }
      
      fetchSessions();
    }
  }, [authLoading, isAuthenticated, router, fetchSessions]);
  
  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentWeek({
      startDate: addDays(currentWeek.startDate, -7),
      endDate: addDays(currentWeek.endDate, -7),
    });
  };
  
  const goToNextWeek = () => {
    setCurrentWeek({
      startDate: addDays(currentWeek.startDate, 7),
      endDate: addDays(currentWeek.endDate, 7),
    });
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeek({
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
  };
  
  // Reservation functions
  const handleReserve = (session: TrainingSession) => {
    if (!user?.subscription_id) {
      // Show subscription required message
      setError('You need an active subscription to make reservations.');
      return;
    }
    
    setSelectedSession(session);
    setShowReservationModal(true);
  };
  
  const confirmReservation = async () => {
    if (!selectedSession) return;
    
    setReservationLoading(true);
    setError(null);
    
    try {
      await createReservation({ training_session_id: selectedSession.id });
      
      // Show success message
      setSuccessMessage('Reservation successful! You are now registered for this training session.');
      
      // Close modal
      setShowReservationModal(false);
      
      // Refresh sessions
      await fetchSessions();
    } catch (err: any) {
      console.error('Error making reservation:', err);
      setError(err.message || 'Failed to make reservation. Please try again.');
    } finally {
      setReservationLoading(false);
    }
  };
  
  const handleCancelReservation = async (session: TrainingSession) => {
    if (!session.user_reservation_id) return;
    
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await cancelReservation(session.user_reservation_id);
      
      // Show success message
      setSuccessMessage('Reservation cancelled successfully.');
      
      // Refresh sessions
      await fetchSessions();
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      setError(err.message || 'Failed to cancel reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render functions
  const renderSessionCard = (session: TrainingSession) => {
    const startTime = format(parseISO(session.start_time), 'h:mm a');
    const endTime = format(parseISO(session.end_time), 'h:mm a');
    const isFull = session.is_full;
    const hasReservation = session.user_has_reservation;
    
    return (
      <div 
        key={session.id} 
        className={`p-4 mb-2 rounded-lg shadow ${
          isDark 
            ? (session.is_cancelled ? 'bg-gray-700 opacity-50' : 'bg-gray-800') 
            : (session.is_cancelled ? 'bg-gray-100 opacity-50' : 'bg-white')
        }`}
      >
        {session.is_cancelled && (
          <div className="mb-2 text-red-500 font-bold flex items-center">
            <FiAlertCircle className="mr-1" />
            Cancelled
          </div>
        )}
        
        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {session.title}
        </h3>
        
        <div className="mt-2 space-y-1">
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
          
          <div className={`flex items-center text-sm ${
            isFull ? 'text-red-500' : 'text-green-500'
          }`}>
            <span>
              {session.remaining_spaces} spot{session.remaining_spaces !== 1 ? 's' : ''} remaining
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          {!session.is_cancelled && (
            hasReservation ? (
              <button
                onClick={() => handleCancelReservation(session)}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Cancel Reservation
              </button>
            ) : (
              <button
                onClick={() => handleReserve(session)}
                disabled={isFull}
                className={`px-3 py-1 text-sm rounded ${
                  isFull 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } transition-colors`}
              >
                {isFull ? 'Full' : 'Reserve Spot'}
              </button>
            )
          )}
        </div>
      </div>
    );
  };
  
  const renderDayColumn = (day: DaySchedule) => {
    const dayName = format(day.date, 'EEEE');
    const dayDate = format(day.date, 'MMM d');
    const isToday = isSameDay(day.date, new Date());
    
    return (
      <div key={dayName} className="flex-1 min-w-[140px]">
        <div className={`text-center p-2 font-medium ${
          isToday
            ? 'bg-indigo-600 text-white rounded-t'
            : isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'
        }`}>
          <div>{dayName}</div>
          <div className="text-sm">{dayDate}</div>
        </div>
        
        <div className={`p-2 h-full ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          {day.sessions.length > 0 ? (
            day.sessions.map(session => renderSessionCard(session))
          ) : (
            <div className="text-center p-4 text-gray-500">
              No sessions scheduled
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderReservationModal = () => {
    if (!selectedSession) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-lg p-6 max-w-md w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Confirm Reservation</h2>
          
          <div className="mb-4">
            <p><strong>Session:</strong> {selectedSession.title}</p>
            <p><strong>Date:</strong> {format(parseISO(selectedSession.start_time), 'EEEE, MMMM d, yyyy')}</p>
            <p><strong>Time:</strong> {format(parseISO(selectedSession.start_time), 'h:mm a')} - {format(parseISO(selectedSession.end_time), 'h:mm a')}</p>
            {selectedSession.location && <p><strong>Location:</strong> {selectedSession.location}</p>}
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReservationModal(false)}
              className={`px-4 py-2 rounded ${
                isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            
            <button
              onClick={confirmReservation}
              disabled={reservationLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {reservationLoading ? 'Processing...' : 'Confirm Reservation'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Training Schedule</h1>
        
        {/* Week navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousWeek}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <FiChevronLeft size={20} />
            </button>
            
            <button
              onClick={goToCurrentWeek}
              className={`flex items-center px-3 py-1 rounded ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <FiCalendar className="mr-1" /> Current Week
            </button>
            
            <button
              onClick={goToNextWeek}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          
          <div className="font-medium">
            {format(currentWeek.startDate, 'MMM d')} - {format(currentWeek.endDate, 'MMM d, yyyy')}
          </div>
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
        
        {/* Subscription check */}
        {isAuthenticated && !user?.subscription_id && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            <p className="font-bold">Subscription Required</p>
            <p>You need an active subscription to make reservations for training sessions.</p>
            <button 
              onClick={() => router.push('/subscriptions')}
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded"
            >
              View Subscription Plans
            </button>
          </div>
        )}
        
        {/* Week schedule */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4">Loading schedule...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {weekSchedule.map(day => renderDayColumn(day))}
            </div>
          </div>
        )}
      </div>
      
      {/* Reservation modal */}
      {showReservationModal && renderReservationModal()}
    </div>
  );
}
