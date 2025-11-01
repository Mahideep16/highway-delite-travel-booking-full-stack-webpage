import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExperiences, Experience, API_ORIGIN } from '../services/api';
import ImageWithFallback from './ImageWithFallback';
import { slugify } from '../utils/slug';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch all experiences on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      }
    };
    fetchExperiences();
  }, []);

  // Filter experiences based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExperiences([]);
      setShowSuggestions(false);
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
    setShowSuggestions(true);
  }, [searchQuery, experiences]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredExperiences.length > 0) {
      navigate(`/experience/${filteredExperiences[0].id}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSelectExperience = (id: string) => {
    navigate(`/experience/${id}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">highway delite</span>
          </Link>

          <div className="flex items-center space-x-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="hidden md:block w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && filteredExperiences.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-3 py-2">
                      {filteredExperiences.length} result{filteredExperiences.length !== 1 ? 's' : ''} found
                    </p>
                    {filteredExperiences.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => handleSelectExperience(exp.id)}
                        className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-3"
                      >
                        <ImageWithFallback
                          sources={[
                            `${API_ORIGIN}/images/${slugify(exp.name)}-${slugify(exp.location)}.jpg`,
                            `${API_ORIGIN}/images/${slugify(exp.name)}-${slugify(exp.location)}.jpeg`,
                            `${API_ORIGIN}/images/${slugify(exp.name)}.jpg`,
                            `${API_ORIGIN}/images/${slugify(exp.name)}.jpeg`,
                            `${API_ORIGIN}/images/${slugify(exp.name)}.png`,
                            exp.image,
                          ]}
                          alt={exp.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{exp.name}</div>
                          <div className="text-xs text-gray-500">{exp.location}</div>
                          <div className="text-xs font-semibold text-gray-900 mt-1">
                            From ₹{exp.price}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {showSuggestions && searchQuery && filteredExperiences.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50">
                  <p className="text-sm text-gray-500 text-center">
                    No experiences found for "{searchQuery}"
                  </p>
                </div>
              )}
            </form>

            <button
              onClick={handleSearch}
              disabled={filteredExperiences.length === 0}
              className={`btn ${
                filteredExperiences.length > 0 ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
