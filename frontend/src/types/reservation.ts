export interface TrainingSession {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  capacity: number;
  trainer_name: string | null;
  location: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  type: string;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;
  
  remaining_spaces?: number;
  is_full?: boolean;
  user_has_reservation?: boolean;
  user_reservation_id?: number | null;
  reservation_id?: number | null;
  active_reservations_count?: number;
  
  user_reservation?: Reservation | Record<string, any> | null;
}

export interface Reservation {
  id: number;
  user_id: number;
  training_session_id: number;
  reserved_at: string;
  attended: boolean;
  cancelled: boolean;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  

  trainingSession?: TrainingSession;
  user?: {
    id: number;
    name: string;
    lastname: string;
    email: string;
  };
}

export interface ReservationFormData {
  training_session_id: number;
}

export interface CancellationFormData {
  reason: string;
}

export interface WeekNavigationState {
  startDate: Date;
  endDate: Date;
}

export type DaySchedule = {
  date: Date;
  sessions: TrainingSession[];
};

export type WeekSchedule = DaySchedule[];
