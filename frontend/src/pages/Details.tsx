import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExperienceById, ExperienceDetail, Slot } from '../services/api';
import Loading from '../components/Loading';
import ImageWithFallback from '../components/ImageWithFallback';
import { slugify } from '../utils/slug';
import { API_ORIGIN } from '../services/api';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getExperienceById(id);
        setExperience(data);
        
        // Pre-select first available date
        if (data.slots && data.slots.length > 0) {
          const uniqueDates = Array.from(new Set(data.slots.map(s => s.date)));
          setSelectedDate(uniqueDates[0]);
        }
      } catch (err) {
        setError('Failed to load experience details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const getUniqueDates = () => {
    if (!experience?.slots) return [];
    return Array.from(new Set(experience.slots.map(s => s.date))).sort();
  };

  const getAvailableSlotsForDate = (date: string) => {
    if (!experience?.slots) return [];
    return experience.slots.filter(s => s.date === date);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        quantity,
      },
    });
  };

  const calculateSubtotal = () => {
    if (!experience) return 0;
    return experience.price * quantity;
  };

  const calculateTaxes = () => {
    return calculateSubtotal() * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  if (loading) {
    return <Loading message="Loading experience details..." />;
  }

  if (error || !experience) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || 'Experience not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = getAvailableSlotsForDate(selectedDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <span className="mr-2">←</span> Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Experience Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <ImageWithFallback
              sources={[
                `${API_ORIGIN}/images/${slugify(experience.name)}-${slugify(experience.location)}.jpg`,
                `${API_ORIGIN}/images/${slugify(experience.name)}-${slugify(experience.location)}.jpeg`,
                `${API_ORIGIN}/images/${slugify(experience.name)}.jpg`,
                `${API_ORIGIN}/images/${slugify(experience.name)}.jpeg`,
                `${API_ORIGIN}/images/${slugify(experience.name)}.png`,
                experience.image,
              ]}
              alt={experience.name}
              className="w-full h-96 object-cover"
            />
            
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{experience.name}</h1>
              <p className="text-gray-700 leading-relaxed">{experience.description}</p>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Choose date</h2>
                <div className="flex flex-wrap gap-2">
                  {getUniqueDates().map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={`px-4 py-2 rounded-md border ${
                        selectedDate === date
                          ? 'bg-primary border-primary text-black'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Choose time</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={slot.availableSpots === 0}
                      className={`p-3 rounded-md border text-sm ${
                        slot.availableSpots === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedSlot?.id === slot.id
                          ? 'bg-primary border-primary text-black'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div>{slot.time}</div>
                      <div className="text-xs mt-1">
                        {slot.availableSpots === 0 ? (
                          <span className="text-red-500">Sold out</span>
                        ) : (
                          <span className="text-green-600">
                            {slot.availableSpots} left
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All times are in IST (GMT +5:30)
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-600">
                  Scenic routes, trained guides, and safety briefing. Minimum age 10.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-600">Starts at</span>
                <div className="text-2xl font-bold">₹{experience.price}</div>
              </div>

              <div className="border-t pt-4 mb-4">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{Math.round(calculateTaxes())}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{Math.round(calculateTotal())}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedSlot}
                className={`w-full mt-6 btn ${
                  selectedSlot ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
