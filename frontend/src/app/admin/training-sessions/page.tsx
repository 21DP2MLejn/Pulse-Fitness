'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { FiCalendar, FiPlus, FiEdit, FiTrash2, FiX, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTrainingSessions,
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
  cancelTrainingSession,
  getSessionReservations
} from '@/services/reservationService';
import { TrainingSession, DaySchedule, WeekSchedule } from '@/types/reservation';

export default function AdminTrainingSessionsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  // State for training sessions
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State for session form
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    capacity: 30,
    trainer_name: '',
    location: '',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    type: 'group',
  });
  
  // State for week navigation
  const [currentWeek, setCurrentWeek] = useState({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  
  // State for reservations view
  const [showReservations, setShowReservations] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

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
      // Check if user is admin
      if (!isAuthenticated || (user && user.role !== 'admin')) {
        router.push('/auth/login?redirect=/admin/training-sessions');
        return;
      }
      
      fetchSessions();
    }
  }, [authLoading, isAuthenticated, user, router, fetchSessions]);

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

  // Session form handlers
  const openAddSessionForm = () => {
    // Reset form data
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      capacity: 30,
      trainer_name: '',
      location: '',
      difficulty_level: 'beginner',
      type: 'group',
    });
    setEditingSession(null);
    setShowSessionForm(true);
  };
  
  const openEditSessionForm = (session: TrainingSession) => {
    // Format dates for datetime-local input
    const startDateTime = format(new Date(session.start_time), "yyyy-MM-dd'T'HH:mm");
    const endDateTime = format(new Date(session.end_time), "yyyy-MM-dd'T'HH:mm");
    
    setFormData({
      title: session.title,
      description: session.description || '',
      start_time: startDateTime,
      end_time: endDateTime,
      capacity: session.capacity,
      trainer_name: session.trainer_name || '',
      location: session.location || '',
      difficulty_level: session.difficulty_level,
      type: session.type,
    });
    setEditingSession(session);
    setShowSessionForm(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'difficulty_level') {
      // Ensure difficulty_level is one of the allowed values
      const difficultyLevel = value as 'beginner' | 'intermediate' | 'advanced';
      setFormData(prev => ({ ...prev, [name]: difficultyLevel }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (editingSession) {
        // Update existing session
        await updateTrainingSession(editingSession.id, formData);
        setSuccessMessage('Training session updated successfully');
      } else {
        // Create new session
        await createTrainingSession(formData);
        setSuccessMessage('Training session created successfully');
      }
      
      // Close form and refresh data
      setShowSessionForm(false);
      await fetchSessions();
    } catch (err: any) {
      console.error('Error saving training session:', err);
      setError(err.message || 'Failed to save training session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Session management functions
  const handleDeleteSession = async (session: TrainingSession) => {
    if (!confirm(`Are you sure you want to delete "${session.title}"?`)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteTrainingSession(session.id);
      setSuccessMessage('Training session deleted successfully');
      await fetchSessions();
    } catch (err: any) {
      console.error('Error deleting training session:', err);
      setError(err.message || 'Failed to delete training session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelSession = async (session: TrainingSession) => {
    if (!confirm(`Are you sure you want to cancel "${session.title}"? All reservations will be cancelled.`)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await cancelTrainingSession(session.id);
      setSuccessMessage('Training session cancelled successfully');
      await fetchSessions();
    } catch (err: any) {
      console.error('Error cancelling training session:', err);
      setError(err.message || 'Failed to cancel training session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reservations view handlers
  const viewSessionReservations = async (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setReservationsLoading(true);
    setShowReservations(true);
    
    try {
      const data = await getSessionReservations(sessionId);
      setReservations(data.reservations || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations. Please try again.');
    } finally {
      setReservationsLoading(false);
    }
  };
  
  // Render functions
  const renderSessionCard = (session: TrainingSession) => {
    const startTime = session.start_time.slice(11, 16);
    const endTime = session.end_time.slice(11, 16);
    
    return (
      <div 
        key={session.id} 
        className={`p-4 mb-2 rounded-lg shadow ${
          isDark 
            ? (session.is_cancelled ? 'bg-gray-700 opacity-70' : 'bg-gray-800') 
            : (session.is_cancelled ? 'bg-gray-100 opacity-70' : 'bg-white')
        }`}
      >
        {session.is_cancelled && (
          <div className="mb-2 text-red-500 font-bold flex items-center">
            <FiAlertCircle className="mr-1" />
            {t('sessions.cancelled')}
          </div>
        )}
        
        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {session.title}
        </h3>
        
        <div className="mt-2 space-y-1 text-sm">
          <div>{startTime} - {endTime}</div>
          {session.location && <div>{t('sessions.location')}: {session.location}</div>}
          {session.trainer_name && <div>{t('sessions.trainer')}: {session.trainer_name}</div>}
          <div>
            {t('sessions.capacity')}: {session.active_reservations_count || 0}/{session.capacity}
          </div>
        </div>
        
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => viewSessionReservations(session.id)}
            className="px-2 py-1 text-xs rounded flex items-center bg-blue-500 text-white hover:bg-blue-600"
          >
            <FiUsers className="mr-1" /> {t('sessions.reservations')}
          </button>
          
          {!session.is_cancelled && (
            <>
              <button
                onClick={() => openEditSessionForm(session)}
                className="px-2 py-1 text-xs rounded flex items-center bg-green-500 text-white hover:bg-green-600"
              >
                <FiEdit className="mr-1" /> {t('sessions.editSession')}
              </button>
              
              <button
                onClick={() => handleCancelSession(session)}
                className="px-2 py-1 text-xs rounded flex items-center bg-yellow-500 text-white hover:bg-yellow-600"
              >
                <FiX className="mr-1" /> {t('sessions.cancelSession')}
              </button>
            </>
          )}
          
          <button
            onClick={() => handleDeleteSession(session)}
            className="px-2 py-1 text-xs rounded flex items-center bg-red-500 text-white hover:bg-red-600"
          >
            <FiTrash2 className="mr-1" /> {t('sessions.deleteSession')}
          </button>
        </div>
      </div>
    );
  };
  
  const renderDayColumn = (day: DaySchedule) => {
    const dayName = format(day.date, 'EEEE');
    const dayDate = format(day.date, 'MMM d');
    
    return (
      <div key={dayName} className="flex-1 min-w-[170px]">
        <div className={`text-center p-2 font-medium ${
          isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'
        }`}>
          <div>{dayName}</div>
          <div className="text-sm">{dayDate}</div>
        </div>
        
        <div className={`p-2 min-h-[200px] ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          {day.sessions.length > 0 ? (
            day.sessions.map(session => renderSessionCard(session))
          ) : (
            <div className="text-center p-4 text-gray-500">
              {t('sessions.noSessions')}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderSessionForm = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-lg p-6 max-w-2xl w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {editingSession ? t('sessions.editSession') : t('sessions.addSession')}
            </h2>
            <button
              onClick={() => setShowSessionForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmitSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('sessions.sessionTitle')}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('sessions.description')}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('sessions.startTime')}</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('sessions.endTime')}</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('sessions.difficultyLevel')}</label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="beginner">{t('sessions.difficulty.beginner')}</option>
                  <option value="intermediate">{t('sessions.difficulty.intermediate')}</option>
                  <option value="advanced">{t('sessions.difficulty.advanced')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('sessions.type')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="group">{t('sessions.type.group')}</option>
                  <option value="personal">{t('sessions.type.personal')}</option>
                </select>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowSessionForm(false)}
                className={`px-4 py-2 rounded ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {t('sessions.cancel')}
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                {t('sessions.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const renderReservationsModal = () => {
    if (!selectedSessionId) return null;
    
    const session = weekSchedule
      .flatMap(day => day.sessions)
      .find(s => s.id === selectedSessionId);
    
    if (!session) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-lg p-6 max-w-2xl w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {t('sessions.reservationsTitle')}: {session.title}
            </h2>
            <button
              onClick={() => setShowReservations(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="mb-4">
            <p><strong>{t('sessions.date')}:</strong> {format(parseISO(session.start_time), 'EEEE, MMMM d, yyyy')}</p>
            <p><strong>{t('sessions.time')}:</strong> {session.start_time.slice(11, 16)} - {session.end_time.slice(11, 16)}</p>
            <p><strong>{t('sessions.reservations')}:</strong> {t('sessions.reservationsCount', { count: reservations.length.toString(), capacity: session.capacity.toString() })}</p>
          </div>
          
          {reservationsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2">Loading reservations...</p>
            </div>
          ) : (
            <>
              {reservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('sessions.noReservations')}
                </div>
              ) : (
                <div className={`border rounded-lg overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Reserved At
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.user.name} {reservation.user.lastname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {format(parseISO(reservation.reserved_at), 'MMM d, yyyy h:mm a')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.cancelled ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                {t('sessions.cancelled')}
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {t('sessions.active')}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('sessions.title')}</h1>
          
          <button
            onClick={openAddSessionForm}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FiPlus /> {t('sessions.addSession')}
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
        
        {/* Week navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousWeek}
              className={`p-2 rounded ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              ← {t('sessions.previousWeek')}
            </button>
            
            <button
              onClick={goToCurrentWeek}
              className={`flex items-center px-3 py-1 rounded ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <FiCalendar className="mr-1" /> {t('sessions.currentWeek')}
            </button>
            
            <button
              onClick={goToNextWeek}
              className={`p-2 rounded ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              {t('sessions.nextWeek')} →
            </button>
          </div>
          
          <div className="font-medium">
            {format(currentWeek.startDate, 'MMM d')} - {format(currentWeek.endDate, 'MMM d, yyyy')}
          </div>
        </div>
        
        {/* Week schedule */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4">{t('sessions.loading')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {weekSchedule.map(day => renderDayColumn(day))}
            </div>
          </div>
        )}
      </div>
      
      {/* Session form modal */}
      {showSessionForm && renderSessionForm()}
      
      {/* Reservations modal */}
      {showReservations && renderReservationsModal()}
    </div>
  );
}
