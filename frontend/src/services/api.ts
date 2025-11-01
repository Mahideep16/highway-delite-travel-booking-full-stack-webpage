import axios from 'axios';

// If VITE_API_URL isn't provided (e.g., Vercel-only static hosting), we'll use static JSON fallbacks.
const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
// Derive the backend origin (without trailing /api) for assets like images
export const API_ORIGIN = (API_BASE_URL || '').replace(/\/api\/?$/, '');

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

interface RawExperience {
  id: string | number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  slots?: RawSlot[];
}

interface RawSlot {
  id: string | number;
  date: string;
  time: string;
  availableSpots: number;
  totalSpots: number;
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
  // Try API if available; otherwise fallback to static JSON
  if (API_BASE_URL) {
    try {
      const response = await api.get('/experiences');
      return response.data.data as Experience[];
    } catch (e) {
      console.warn('API getExperiences failed, using static fallback:', e);
    }
  }

  const res = await fetch('/data/experiences.json', { cache: 'no-store' });
  const json = await res.json() as { experiences?: RawExperience[] };
  // file shape: { experiences: Array<{... , slots: Slot[]}> }
  return (json.experiences || []).map((e: RawExperience) => ({
    id: String(e.id),
    name: e.name,
    location: e.location,
    description: e.description,
    image: e.image,
    price: e.price,
  })) as Experience[];
};

export const getExperienceById = async (id: string): Promise<ExperienceDetail> => {
  if (API_BASE_URL) {
    try {
      const response = await api.get(`/experiences/${id}`);
      return response.data.data as ExperienceDetail;
    } catch (e) {
      console.warn('API getExperienceById failed, using static fallback:', e);
    }
  }

  const res = await fetch('/data/experiences.json', { cache: 'no-store' });
  const json = await res.json() as { experiences?: RawExperience[] };
  const found = (json.experiences || []).find((e: RawExperience) => String(e.id) === String(id));
  if (!found) throw new Error('Experience not found in static data');
  // If no slots provided in static file, generate a simple 5-day schedule
  const ensureSlots = (): RawSlot[] => {
    const out: RawSlot[] = [];
    if (found.slots && found.slots.length > 0) return found.slots;
    const times = [
      { time: '07:00 am', slots: 4 },
      { time: '9:00 am', slots: 2 },
      { time: '11:00 am', slots: 5 },
      { time: '1:00 pm', slots: 0 },
    ];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      const date = d.toISOString().slice(0, 10);
      for (const t of times) {
        out.push({
          id: `${found.id}-${date}-${t.time}`,
          date,
          time: t.time,
          availableSpots: t.slots,
          totalSpots: 10,
        });
      }
    }
    return out;
  };
  return {
    id: String(found.id),
    name: found.name,
    location: found.location,
    description: found.description,
    image: found.image,
    price: found.price,
    slots: ensureSlots().map((s: RawSlot) => ({
      id: String(s.id),
      experienceId: String(found.id),
      date: s.date,
      time: s.time,
      availableSpots: s.availableSpots,
      totalSpots: s.totalSpots,
    })),
  } as ExperienceDetail;
};

export const createBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
  if (API_BASE_URL) {
    try {
      const response = await api.post('/bookings', booking);
      return response.data as BookingResponse;
    } catch (e) {
      console.warn('API createBooking failed, using static simulated result:', e);
    }
  }

  // Simulate a successful booking for static demo
  const priceRes = await getExperienceById(booking.experienceId).catch(() => null);
  const unit = priceRes?.price ?? 1000;
  const qty = booking.quantity || 1;
  const base = unit * qty;
  const taxes = Math.round(base * 0.05);
  const total = base + taxes;

  return {
    success: true,
    message: 'Simulated booking (static demo).',
    data: {
      bookingRef: 'DEMO-' + Date.now(),
      experienceName: priceRes?.name || 'Experience',
      date: booking.date,
      time: booking.time,
      quantity: qty,
      total,
    },
  } as BookingResponse;
};

export const validatePromoCode = async (
  code: string,
  subtotal: number
): Promise<PromoValidation> => {
  if (API_BASE_URL) {
    try {
      const response = await api.post('/promo/validate', { code, subtotal });
      return response.data as PromoValidation;
    } catch (error: unknown) {
      console.warn('API validatePromoCode failed, using static validation:', error);
    }
  }

  // Static fallback: simple promo codes
  const promos: Record<string, { type: 'percentage' | 'flat'; value: number }> = {
    SAVE10: { type: 'percentage', value: 10 },
    FLAT100: { type: 'flat', value: 100 },
    WELCOME20: { type: 'percentage', value: 20 },
  };
  const p = promos[code.toUpperCase()];
  if (!p) return { success: false, message: 'Invalid promo code' };
  const discount = p.type === 'percentage' ? Math.round((subtotal * p.value) / 100) : p.value;
  return { success: true, data: { code: code.toUpperCase(), type: p.type, value: p.value, discount } };
};

export default api;
