import React from 'react';
import './MovieList.css';
import * as a from 'antd';

import Card from '../Card';

const MovieList = ({ filmsList }) => {
  const filteredFilms = filmsList
    .filter((el) => {
      return el.id && el.title && el.genres && el.overview && el.release_date && el.poster_path;
    })
    .slice(0, 6);
  const filmArr = filteredFilms.map((item) => (
    <Card
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
      <a.Flex gap="large" justify="space-around" flex align="flex-start" wrap="wrap">
        {filmArr}
      </a.Flex>
    </ul>
  );
};

export default MovieList;
