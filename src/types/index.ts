// User roles
export type UserRole = "admin" | "encargado" | "brigadista";

// Notification types
export type NotificationType =
  | "survey_created"
  | "survey_deleted"
  | "version_published"
  | "assignment_created"
  | "user_registered";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface UnreadCountResponse {
  count: number;
}

// User types
export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  telefono?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  activo: boolean;
}

export interface AuthUser extends User {
  access_token: string;
  refresh_token?: string;
}

// Survey types (matching backend schema)
export interface Survey {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  created_by: number;
  starts_at?: string | null;
  ends_at?: string | null;
  estimated_duration_minutes?: number | null;
  max_responses?: number | null;
  allow_anonymous: boolean;
  created_at: string;
  updated_at?: string;
  versions?: SurveyVersion[];
}

export interface SurveyVersion {
  id: number;
  survey_id: number;
  version_number: number;
  is_published: boolean;
  change_summary?: string;
  created_at: string;
  questions: Question[];
}

export interface Question {
  id: number;
  version_id: number;
  question_text: string;
  question_type: QuestionType;
  order: number;
  is_required: boolean;
  validation_rules?: Record<string, any>;
  options?: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  question_id?: number;
  option_text: string;
  order: number;
}

export type QuestionType =
  // Text inputs
  | "text"
  | "textarea"
  | "email"
  | "phone"
  // Numeric
  | "number"
  | "slider"
  | "scale"
  | "rating"
  // Choice
  | "single_choice"
  | "multiple_choice"
  | "yes_no"
  // Date/Time
  | "date"
  | "time"
  | "datetime"
  // Media & special
  | "photo"
  | "file"
  | "signature"
  | "location"
  | "ine_ocr";

// Legacy types (for backward compatibility)
export interface SurveyQuestion extends Question {
  encuesta_id?: number;
  pregunta?: string;
  tipo_pregunta?: QuestionType;
  requerido?: boolean;
  orden?: number;
  opciones?: string[];
}

// Assignment types
export interface Assignment {
  id: number;
  user_id: number;
  survey_id: number;
  assigned_by: number;
  status: AssignmentStatus;
  location?: string;
  created_at: string;
  updated_at?: string;
  // Populated in list view (AssignmentDetailResponse)
  user?: {
    id: number;
    full_name: string;
    email: string;
  };
  survey?: {
    id: number;
    title: string;
  };
}

export type AssignmentStatus = "pending" | "in_progress" | "completed";

// Response types
export interface SurveyResponse {
  id: number;
  asignacion_id: number;
  encuesta_id: number;
  respondido_por: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: "borrador" | "enviado" | "rechazado";
  respuestas: QuestionResponse[];
}

export interface QuestionResponse {
  pregunta_id: number;
  valor: any;
  archivos_adjuntos?: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
