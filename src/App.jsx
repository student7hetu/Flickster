import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Spinner from './components/Spinner.jsx';
import MovieCards from './components/MovieCards.jsx';
import Search from './components/Search.jsx';
import { updateSearchCount } from '../appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '', pageNumber = 1, append = false) => {
    if (!append) setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&api_key=${API_KEY}&page=${pageNumber}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${pageNumber}`;

      const response = await fetch(endpoint);

      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
        return;
      }

      setMovieList((prevMovies) =>
        append ? [...prevMovies, ...data.results] : data.results
      );

      setHasMore(data.page < data.total_pages);

      if (query && data.results.length > 0 && pageNumber === 1) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      if (!append) setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setMovieList([]); // clear old data for new search
    setHasMore(true);
    fetchMovies(debouncedSearchTerm, 1, false);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='public/assets/hero.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span> you'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCards key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
        {hasMore && !isLoading && (
          <div className='text-center mt-6'>
            <button
              onClick={() => {
                if (isLoading) return;
                const nextPage = page + 1;
                setPage(nextPage);
                fetchMovies(debouncedSearchTerm, nextPage, true);
              }}
              className='px-4 py-2 bg-indigo-800 text-white rounded hover:bg-blue-600 transition'
            >
              Load More
            </button>
          </div>
        )}
        <footer className='mt-16 text-2xl text-white text-center border-t pt-4'>
          <p>
            Made with ❤️ by{' '}
            <a className='text-gradient'
              href='https://github.com/yourusername/flickster'
              target='_blank'
              rel='noopener noreferrer'
            >
              Hetu Patel
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default App;
