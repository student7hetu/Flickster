import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
      }
    };

    fetchMovie();
  }, [id]);

  if (error) return <p className='text-red-500'>{error}</p>;
  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <div className='relative flex items-center justify-center h-15'>
        <button
          onClick={() => navigate('/')}
          className='absolute left-7 top-6 px-4 py-2 bg-indigo-900 text-white rounded hover:bg-blue-600 transition'
        >
          ← Back
        </button>
      </div>

      <div className='p-6 max-w-4xl mx-auto flex flex-col items-center relative'>
        <h1 className='text-3xl font-bold mb-4 text-gradient'>{movie.title}</h1>
        <div className='mb-9 flex bg-gray-600 p- rounded-md shadow-lg'>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className='w-full max-w-sm rounded-md shadow-lg border-white border-2'
          />
        </div>

        <div className='text-lg text-gray-300 border-2 flex flex-col items-start p-4 rounded-md shadow-lg'>
          <p className='mb-2 text-white font-light'>
            <strong className='text-gradient'>Release Date:</strong>{' '}
            {movie.release_date}
          </p>
          <p className='mb-2 text-white font-light'>
            <strong className='text-gradient'>Rating:</strong>{' '}
            {movie.vote_average}
          </p>
          <p className='mb-2 text-white font-light'>
            <strong className='text-gradient'>Language:</strong>{' '}
            {movie.original_language}
          </p>
          <p className='mb-2 text-white font-light'>
            <strong className='text-gradient'>Overview:</strong>{' '}
            {movie.overview}
          </p>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
