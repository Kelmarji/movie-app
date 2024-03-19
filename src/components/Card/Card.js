/* eslint-disable no-restricted-syntax */
import React from 'react';
import './Card.css';
import { format } from 'date-fns';

import { MovieAppConsumer } from '../MovieAppContextService/MovieAppContextService';

const descLength = (text) => `${text.split(' ').slice(0, 30).join(' ')} ${'...'}`;

const Card = (props) => {
  const { label, genres, desc, date, id, poster } = props;
  const idsGenres = [];
  let genresToSpan = [];

  if (typeof genres[0] === 'object') {
    for (const item of genres) {
      idsGenres.push(Number(item.id));
    }
    genresToSpan = idsGenres;
  } else {
    genresToSpan = genres;
  }

  return (
    <li key={id} id={id} className="movie__card">
      <div className="card__image">
        <img className="cardImg" src={`https://image.tmdb.org/t/p/w185${poster}`} alt={label} />
      </div>
      <div className="card__info">
        <h1 className="card__name">{label}</h1>
        <span className="card__time">{`${format(new Date(date), 'MMMM dd, yyyy')}`}</span>
        <ul className="card__theme">
          {genresToSpan.map((item) => {
            return (
              <MovieAppConsumer key={item}>
                {(genr) => {
                  const genreName = genr.find((genre) => genre.id === item);
                  return (
                    <li key={item} className="marked">
                      <span>{genreName ? genreName.name : ''}</span>
                    </li>
                  );
                }}
              </MovieAppConsumer>
            );
          })}
        </ul>
        <span className="movie__info">{descLength(desc)}</span>
      </div>
    </li>
  );
};

export default Card;
