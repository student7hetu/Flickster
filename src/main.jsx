import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/movie/:id' element={<MovieDetails />} />
    </Routes>
  </BrowserRouter>
);
