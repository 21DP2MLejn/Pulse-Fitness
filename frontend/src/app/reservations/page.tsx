'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays, startOfWeek, parseISO, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiMapPin, FiUser, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import * as reservationService from '@/services/reservationService';
import { TrainingSession, DaySchedule, WeekSchedule } from '@/types/reservation';

export default function ReservationsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  
  // State
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingSessionId, setProcessingSessionId] = useState<number | null>(null);
  
  // Current week navigation
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    return {
      startDate: startOfWeek(today, { weekStartsOn: 1 }),
      endDate: addDays(startOfWeek(today, { weekStartsOn: 1 }), 6)
    };
  });
  
  // Clear messages after a delay
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);
  
  // Fetch sessions data - simplified version
  const fetchSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    
    try {
      const startDateStr = format(currentWeek.startDate, 'yyyy-MM-dd');
      const endDateStr = format(currentWeek.endDate, 'yyyy-MM-dd');
      
      const sessions = await reservationService.getTrainingSessions(startDateStr, endDateStr, true);
      
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
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load training sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentWeek, isAuthenticated]);
  
  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/reservations');
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Load sessions when authenticated or week changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, currentWeek, fetchSessions]);
  
  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentWeek(prev => ({
      startDate: addDays(prev.startDate, -7),
      endDate: addDays(prev.endDate, -7)
    }));
  };
  
  const goToNextWeek = () => {
    setCurrentWeek(prev => ({
      startDate: addDays(prev.startDate, 7),
      endDate: addDays(prev.endDate, 7)
    }));
  };
  
  // Make a reservation - simplified
  const makeReservation = async (session: TrainingSession) => {
    if (!user?.has_subscription) {
      setError('You need an active subscription to make reservations');
      return;
    }
    
    if (!confirm('Do you want to reserve a spot for this session?')) {
      return;
    }
    
    setProcessingSessionId(session.id);
    setError(null);
    
    try {
      await reservationService.createReservation({ training_session_id: session.id });
      setSuccessMessage('Reservation successful!');
      
      // Always fetch fresh data after making a reservation
      await fetchSessions();
    } catch (err: any) {
      const message = err?.message || 'Failed to make reservation';
      setError(message);
    } finally {
      setProcessingSessionId(null);
    }
  };
  
  // Cancel a reservation - simplified
  const cancelReservation = async (session: TrainingSession) => {
    const reservationId = session.user_reservation_id;
    
    if (!reservationId) {
      setError('No reservation found to cancel');
      return;
    }
    
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    setProcessingSessionId(session.id);
    setError(null);
    
    try {
      await reservationService.cancelReservation(reservationId);
      setSuccessMessage('Reservation cancelled successfully!');
      
      // Always fetch fresh data after cancelling
      await fetchSessions();
    } catch (err: any) {
      const message = err?.message || 'Failed to cancel reservation';
      setError(message);
    } finally {
      setProcessingSessionId(null);
    }
  };
  
  // Render a session card
  const renderSessionCard = (session: TrainingSession) => {
    const startTime = parseISO(session.start_time);
    const endTime = parseISO(session.end_time);
    const isPast = new Date() > endTime;
    const isProcessing = processingSessionId === session.id;
    const hasReservation = session.user_has_reservation === true;
    
    return (
      <div
        key={session.id}
        className={`border rounded-lg p-4 mb-3 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } ${isPast || session.is_cancelled ? 'opacity-60' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {session.title}
              {session.is_cancelled && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                  Cancelled
                </span>
              )}
            </h3>
            
            <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</span>
              </div>
              
              {session.location && (
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>{session.location}</span>
                </div>
              )}
              
              {session.trainer_name && (
                <div className="flex items-center">
                  <FiUser className="mr-1" />
                  <span>{session.trainer_name}</span>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-sm">
              {!session.is_cancelled && (
                <span className={`${
                  session.is_full ? 'text-red-500' : 'text-green-500'
                }`}>
                  {session.is_full ? 'Full' : `${session.remaining_spaces} spots remaining`}
                </span>
              )}
              {hasReservation && !session.is_cancelled && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Reserved
                </span>
              )}
            </div>
          </div>
          
          <div className="ml-4">
            {!isPast && !session.is_cancelled && (
              <>
                {hasReservation ? (
                  <button
                    onClick={() => cancelReservation(session)}
                    disabled={isProcessing || loading}
                    className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                      isProcessing || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Cancel Reservation'}
                  </button>
                ) : (
                  !session.is_full && (
                    <button
                      onClick={() => makeReservation(session)}
                      disabled={isProcessing || loading}
                      className={`px-3 py-1 text-white text-sm rounded transition-colors ${
                        isProcessing || loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isProcessing ? 'Processing...' : 'Reserve Spot'}
                    </button>
                  )
                )}
              </>
            )}
            
            {!isPast && !session.is_cancelled && !hasReservation && session.is_full && (
              <span className="text-sm text-red-500">Session Full</span>
            )}
            
            {isPast && <span className="text-sm text-gray-500">Session Ended</span>}
            
            {session.is_cancelled && <span className="text-sm text-red-500">Session Cancelled</span>}
          </div>
        </div>
      </div>
    );
  };
  
  // Render a day's schedule
  const renderDay = (day: DaySchedule) => {
    const formattedDate = format(day.date, 'EEEE, MMMM d');
    
    return (
      <div key={formattedDate} className="mb-6">
        <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {formattedDate}
        </h2>
        {day.sessions.length > 0 ? (
          day.sessions.map(session => renderSessionCard(session))
        ) : (
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No sessions scheduled for this day
          </p>
        )}
      </div>
    );
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen py-8 px-4 md:px-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Training Sessions</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchSessions}
              disabled={loading}
              className={`p-2 rounded transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-100'
              }`}
              title="Refresh sessions"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
            
            <div className="flex items-center">
              <button
                onClick={goToPreviousWeek}
                disabled={loading}
                className={`p-2 rounded-l transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDark 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                <FiChevronLeft />
              </button>
              <div className={`px-4 py-2 flex items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <FiCalendar className="mr-2" />
                <span className="text-sm">
                  {format(currentWeek.startDate, 'MMM d')} - {format(currentWeek.endDate, 'MMM d, yyyy')}
                </span>
              </div>
              <button
                onClick={goToNextWeek}
                disabled={loading}
                className={`p-2 rounded-r transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDark 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
        
        {/* Subscription check */}
        {user && !user.has_subscription && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-semibold">Active subscription required</p>
            <p>You need an active subscription to make reservations. Please subscribe to continue.</p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{successMessage}</p>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Week schedule */}
        {!loading && weekSchedule.map(day => renderDay(day))}
      </div>
    </div>
  );
}