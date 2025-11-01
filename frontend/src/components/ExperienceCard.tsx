import React from 'react';
import { Link } from 'react-router-dom';
import { Experience, API_ORIGIN } from '../services/api';
import ImageWithFallback from './ImageWithFallback';
import { slugify } from '../utils/slug';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          sources={[
            `/images/${slugify(experience.name)}-${slugify(experience.location)}.jpg`,
            `/images/${slugify(experience.name)}.jpg`,
            `/images/${slugify(experience.name)}.png`,
            `${API_ORIGIN}/images/${slugify(experience.name)}-${slugify(experience.location)}.jpg`,
            `${API_ORIGIN}/images/${slugify(experience.name)}.jpg`,
            experience.image,
          ]}
          alt={experience.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{experience.name}</h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{experience.location}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">From </span>
            <span className="text-lg font-bold">₹{experience.price}</span>
          </div>
          <Link
            to={`/experience/${experience.id}`}
            className="btn btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
