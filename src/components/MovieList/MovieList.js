import React from 'react';
import './MovieList.css';

import Card from '../Card';

const MovieList = ({ filmsList, tab, ratingPost }) => {
  const filteredFilms = filmsList.filter((el) => {
    return (
      el.id &&
      el.title &&
      (tab === 'Search' ? el.genres : el.genre_ids) &&
      el.overview &&
      el.release_date &&
      el.poster_path &&
      el.popularity
    );
  });

  const filmArr = filteredFilms.map((item) => (
    <Card
      ratingPost={ratingPost}
      id={item.id}
      key={item.id}
      label={item.title}
      genres={tab === 'Search' ? item.genres : item.genre_ids}
      desc={item.overview}
      date={item.release_date}
      poster={item.poster_path}
      popularity={item.popularity}
    />
  ));
  return (
    <ul key="uniqueKey" className="movie__list">
      {filmArr}
    </ul>
  );
};

export default MovieList;
