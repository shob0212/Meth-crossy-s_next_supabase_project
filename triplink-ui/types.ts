
export enum Category {
  Transport = 'Transport',
  Food = 'Food',
  Activity = 'Activity',
  Lodging = 'Lodging',
  Other = 'Other'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  payerId: string;
  category: Category;
  date: string;
}

export interface ItineraryEvent {
  id: string;
  title: string;
  startTime: string; // ISO string or HH:mm
  endTime?: string;
  location: string;
  category: Category;
  notes?: string;
  costEstimate?: number;
  date?: string; // YYYY/MM/DD format
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Memory {
  id: string;
  url: string; // Base64 or URL
  caption?: string;
  userId: string;
  date: string;
}

export interface TripMember extends User {
    role: 'admin' | 'editor' | 'viewer';
}

export interface Booking {
  id: string;
  type: 'Flight' | 'Hotel' | 'Activity' | 'Other';
  title: string;
  bookingNumber: string;
  date?: string;
  time?: string;
  notes?: string;
  attachments: string[]; // Base64 URLs
}

export interface Trip {
  id: string;
  title: string;
  dates: string;
  coverImage: string;
  members: TripMember[];
  events: ItineraryEvent[];
  expenses: Expense[];
  messages: ChatMessage[];
  memories: Memory[];
  bookings: Booking[];
  isSaved?: boolean;
  status?: 'upcoming' | 'completed';
}

export interface Invitation {
  id: string;
  tripId: string;
  tripTitle: string;
  tripDates: string;
  tripImage: string;
  inviter: User;
  message?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'message' | 'system';
}

export type ViewState = 'DASHBOARD' | 'TRIP_DETAIL';
export type TripTabState = 'TIMELINE' | 'CALENDAR' | 'MAP' | 'WALLET' | 'BOARD' | 'MEMORIES' | 'BOOKINGS';
export type DashboardTabState = 'HOME' | 'SEARCH' | 'SAVED' | 'NOTIFICATIONS' | 'PROFILE' | 'INVITATIONS' | 'COMPLETED';
export type TripRole = 'admin' | 'editor' | 'viewer';
export type Language = 'ja' | 'en';
