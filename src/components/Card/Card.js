import React from 'react';
import './Card.css';
import { format } from 'date-fns';

import { MovieAppConsumer } from '../MovieAppContextService/MovieAppContextService';

const descLength = (text) => `${text.split(' ').slice(0, 30).join(' ')} ${'...'}`;

const Card = (props) => {
  const { label, genres, desc, date, id, poster } = props;
  return (
    <li key={id} id={id} className="movie__card">
      <div className="card__image">
        <img className="cardImg" src={`https://image.tmdb.org/t/p/w185${poster}`} />
      </div>
      <div className="card__info">
        <h1 className="card__name">{label}</h1>
        <span className="card__time">{`${format(new Date(date), 'MMMM dd, yyyy')}`}</span>
        <ul className="card__theme">
          {genres.map((item) => {
            return (
              <MovieAppConsumer key={item.id}>
                {(genr) => {
                  const genreName = genr.find((genre) => genre.id === item.id);
                  return (
                    <li key={item.id} className="marked">
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
