'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { FiCalendar, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTrainingSessions,
  createReservation,
  cancelReservation,
} from '@/services/reservationService';
import { TrainingSession, DaySchedule, WeekSchedule } from '@/types/reservation';
import ReservationModals from '@/components/ReservationModals';
import { useRouter } from 'next/navigation';

export default function TrainingSessionsPage() {
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [currentWeek, setCurrentWeek] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const startDateStr = format(currentWeek.startDate, 'yyyy-MM-dd');
      const endDateStr = format(currentWeek.endDate, 'yyyy-MM-dd');
      
      const sessions = await getTrainingSessions(startDateStr, endDateStr);
      
      const days: WeekSchedule = [];
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentWeek.startDate, i);
        const daySessions = sessions.filter(session => {
          const sessionDate = new Date(session.start_time);
          return sessionDate.getDate() === date.getDate() && 
                 sessionDate.getMonth() === date.getMonth() && 
                 sessionDate.getFullYear() === date.getFullYear();
        });
        
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
        router.push('/auth/login?redirect=/training-sessions');
        return;
      }
      
      fetchSessions();
    }
  }, [authLoading, isAuthenticated, router, fetchSessions]);

  const handleReserveSession = async (session: TrainingSession) => {
    setSelectedSession(session);
    setShowReserveModal(true);
  };

  const handleConfirmReserve = async () => {
    if (!selectedSession) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await createReservation({
        training_session_id: selectedSession.id,
      });
      setSuccessMessage('Training session reserved successfully');
      await fetchSessions();
    } catch (err: any) {
      console.error('Error reserving training session:', err);
      setError(err.message || 'Failed to reserve training session. Please try again.');
    } finally {
      setLoading(false);
      setShowReserveModal(false);
      setSelectedSession(null);
    }
  };

  const handleCancelReservation = async (session: TrainingSession) => {
    setSelectedSession(session);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (reason?: string) => {
    if (!selectedSession || !reason) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cancelReservation(selectedSession.id, { reason });
      setSuccessMessage('Reservation cancelled successfully');
      await fetchSessions();
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      setError(err.message || 'Failed to cancel reservation. Please try again.');
    } finally {
      setLoading(false);
      setShowCancelModal(false);
      setSelectedSession(null);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ReservationModals
        isOpen={showReserveModal}
        onClose={() => {
          setShowReserveModal(false);
          setSelectedSession(null);
        }}
        onConfirm={handleConfirmReserve}
        type="create"
        isLoading={loading}
      />

      <ReservationModals
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedSession(null);
        }}
        onConfirm={handleConfirmCancel}
        type="cancel"
        isLoading={loading}
      />
    </div>
  );
} 