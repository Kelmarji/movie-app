import React from 'react';
import './MovieList.css';

import Card from '../Card';

const MovieList = ({ filmsList }) => {
  const filteredFilms = filmsList.filter((el) => {
    return el.id && el.title && el.genres.length > 0 && el.overview && el.release_date && el.poster_path;
  });
  // .slice(0, 6);
  const filmArr = filteredFilms.map((item) => (
    <Card
      id={item.id}
      key={item.id}
      label={item.title}
      genres={item.genres}
      desc={item.overview}
      date={item.release_date}
      poster={item.poster_path}
    />
  ));
  return (
    <ul key="uniqueKey" className="movie__list">
      {filmArr}
    </ul>
  );
};

export default MovieList;
