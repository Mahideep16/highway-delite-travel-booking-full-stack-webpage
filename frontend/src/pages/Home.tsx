import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getExperiences, Experience } from '../services/api';
import ExperienceCard from '../components/ExperienceCard';
import Loading from '../components/Loading';

const Home: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (err) {
        setError('Failed to load experiences. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Filter experiences based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experiences.filter(
      (exp) =>
        exp.name.toLowerCase().includes(query) ||
        exp.location.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query)
    );
    setFilteredExperiences(filtered);
  }, [searchQuery, experiences]);

  if (loading) {
    return <Loading message="Loading experiences..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Travel Experiences
        </h1>
        <p className="text-gray-600">
          Discover curated adventures with certified guides and safety first
        </p>
      </div>

      {/* Search context header */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredExperiences.length} result{filteredExperiences.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
          <a href="/" className="text-sm text-primary hover:underline">Clear search</a>
        </div>
      )}

      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No matching experiences.</p>
          <a href="/" className="mt-4 inline-block btn btn-primary">View all</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
