import React from 'react';

import filmArray from '../../services/filmApi';
import './App.css';
import MovieList from '../MovieList';

const films = await filmArray(1);

export default function App() {
  return (
    <div className="App">
      <MovieList filmsList={films} />
    </div>
  );
}
