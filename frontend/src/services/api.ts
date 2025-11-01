import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Derive the backend origin (without trailing /api) for assets like images
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Experience {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
}

export interface Slot {
  id: string;
  experienceId: string;
  date: string;
  time: string;
  availableSpots: number;
  totalSpots: number;
}

export interface ExperienceDetail extends Experience {
  slots: Slot[];
}

export interface BookingRequest {
  experienceId: string;
  slotId: string;
  fullName: string;
  email: string;
  quantity: number;
  promoCode?: string;
  date: string;
  time: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    bookingRef: string;
    experienceName: string;
    date: string;
    time: string;
    quantity: number;
    total: number;
  };
}

export interface PromoValidation {
  success: boolean;
  data?: {
    code: string;
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  };
  message?: string;
}

// API Functions
export const getExperiences = async (): Promise<Experience[]> => {
  const response = await api.get('/experiences');
  return response.data.data;
};

export const getExperienceById = async (id: string): Promise<ExperienceDetail> => {
  const response = await api.get(`/experiences/${id}`);
  return response.data.data;
};

export const createBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
  const response = await api.post('/bookings', booking);
  return response.data;
};

export const validatePromoCode = async (
  code: string,
  subtotal: number
): Promise<PromoValidation> => {
  try {
    const response = await api.post('/promo/validate', { code, subtotal });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid promo code',
    };
  }
};

export default api;
