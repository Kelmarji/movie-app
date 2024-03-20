/* eslint-disable no-restricted-syntax */
import React from 'react';
import './Card.css';
import { format } from 'date-fns';
import * as a from 'antd';

import { MovieAppConsumer } from '../MovieAppContextService/MovieAppContextService';

const descLength = (text) => `${text.split(' ').slice(0, 30).join(' ')} ${'...'}`;

const Card = (props) => {
  const { label, genres, desc, date, id, poster, popularity, ratingPost, rating } = props;
  const idsGenres = [];
  let genresToSpan = [];
  const countStars = (rat) => {
    if (rat > 0) {
      return rat;
    }
    return 0;
  };
  // eslint-disable-next-line no-nested-ternary
  const color = popularity > 70 ? '#66E900' : popularity > 50 ? '#E9D100' : popularity > 30 ? '#E97E00' : '#E90000';

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
        <div className="card__title">
          <h1 className="card__name">{label}</h1>
          <a.Progress
            type="circle"
            percent={popularity}
            strokeColor={color}
            size={'small'}
            format={(percent) => (percent < 100 ? `${(percent / 10).toFixed(1)}` : 10)}
          />
        </div>
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
        {rating ? (
          <a.Rate
            value={countStars(rating)}
            id={id}
            allowHalf
            defaultValue={0}
            onChange={(value) => {
              ratingPost(value, id);
            }}
          />
        ) : (
          <a.Rate
            id={id}
            allowHalf
            defaultValue={0}
            onChange={(value) => {
              ratingPost(value, id);
            }}
          />
        )}
      </div>
    </li>
  );
};

export default Card;
