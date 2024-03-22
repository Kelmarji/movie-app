import React from 'react';
import './MovieList.css';
import * as a from 'antd';

import Card from '../Card';

const MovieList = ({ filmsList = [], tab, ratingPost }) => {
  console.log(filmsList, filmsList.length);
  if (filmsList.length > 0) {
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
        rating={item.rating}
        ratingPost={ratingPost}
        id={item.id}
        key={item.id}
        label={item.title}
        genres={tab === 'Search' ? item.genres : item.genre_ids}
        desc={item.overview}
        date={item.release_date}
        poster={item.poster_path}
        popularity={item.vote_average}
      />
    ));
    return (
      <ul key="uniqueKey" className="movie__list">
        {filmArr}
      </ul>
    );
  }
  return <a.Alert message="Warning" description={'Ops, you don added films in rated list'} type="warning" showIcon />;
};

export default MovieList;
