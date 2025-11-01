import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, bookingRef, experienceName, date, time, quantity, total, message } =
    location.state || {};

  if (!location.state) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8 text-center">
        {success ? (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Ref ID: <span className="font-semibold">{bookingRef}</span>
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{experienceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-bold text-lg">₹{Math.round(total)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to your email address with all the
              details.
            </p>

            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary px-8"
            >
              Back to Home
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Failed
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {message || 'Something went wrong. Please try again.'}
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-primary px-8"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary px-8"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Result;
