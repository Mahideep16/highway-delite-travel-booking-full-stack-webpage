import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createBooking, validatePromoCode } from '../services/api';
import Loading from '../components/Loading';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, quantity } = location.state || {};

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!experience || !slot) {
    navigate('/');
    return null;
  }

  const subtotal = experience.price * quantity;
  const taxRate = 0.05;
  const taxes = (subtotal - discount) * taxRate;
  const total = subtotal - discount + taxes;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and safety policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    try {
      setPromoLoading(true);
      setPromoError('');
      const result = await validatePromoCode(promoCode, subtotal);

      if (result.success && result.data) {
        setDiscount(result.data.discount);
        setPromoError('');
      } else {
        setPromoError(result.message || 'Invalid promo code');
        setDiscount(0);
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
      setDiscount(0);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await createBooking({
        experienceId: experience.id,
        slotId: slot.id,
        fullName,
        email,
        quantity,
        promoCode: promoCode || undefined,
        date: slot.date,
        time: slot.time,
      });

      if (result.success && result.data) {
        navigate('/result', {
          state: {
            success: true,
            bookingRef: result.data.bookingRef,
            experienceName: result.data.experienceName,
            date: result.data.date,
            time: result.data.time,
            quantity: result.data.quantity,
            total: result.data.total,
          },
        });
      }
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Booking failed. Please try again.';
      navigate('/result', {
        state: {
          success: false,
          message: errorMessage,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Processing your booking..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <span className="mr-2">←</span> Checkout
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="promoCode" className="block text-sm font-medium mb-2">
                    Promo code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className="btn bg-black text-white px-6 hover:bg-gray-800"
                    >
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm mt-1">{promoError}</p>
                  )}
                  {discount > 0 && (
                    <p className="text-green-600 text-sm mt-1">
                      Promo code applied! You saved ₹{Math.round(discount)}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the terms and safety policy
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm">{errors.terms}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              Pay and Confirm
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Experience</div>
                  <div className="text-gray-600">{experience.name}</div>
                </div>

                <div>
                  <div className="font-medium">Date</div>
                  <div className="text-gray-600">
                    {new Date(slot.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div>
                  <div className="font-medium">Time</div>
                  <div className="text-gray-600">{slot.time}</div>
                </div>

                <div>
                  <div className="font-medium">Qty</div>
                  <div className="text-gray-600">{quantity}</div>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{Math.round(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{Math.round(taxes)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{Math.round(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
