import React from 'react';

import filmsArr from '../../services/filmApi';
import './App.css';
import MovieList from '../MovieList';

const films = await filmsArr();

console.log(films);

export default function App() {
  return (
    <div className="App">
      <MovieList />
    </div>
  );
}
