/* eslint-disable no-restricted-syntax */
import React from 'react';
import './Card.css';
import { format } from 'date-fns';
import * as a from 'antd';

import { MovieAppConsumer } from '../MovieAppContextService/MovieAppContextService';

import noPoster from './noPoster.png';

const descLength = (text) => (text.length > 150 ? `${text.split(' ').slice(0, 30).join(' ')} ${'...'}` : text);
const namerLength = (text) => (text.split(' ').length > 6 ? `${text.split(' ').slice(0, 6).join(' ')}${'...'}` : text);

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
  const color = popularity > 7 ? '#66E900' : popularity > 5 ? '#E9D100' : popularity > 3 ? '#E97E00' : '#E90000';

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
      <div className="picture">
        <img className="card__image" src={poster ? `https://image.tmdb.org/t/p/w185${poster}` : noPoster} alt={label} />
      </div>
      <div className="card__info">
        <div className="card__header--mobile">
          <div className="card__title">
            <h1 title={label} className="card__name">
              {namerLength(label)}
            </h1>
            <a.Progress
              className="circle_rate"
              type="circle"
              percent={popularity * 10}
              strokeColor={color}
              size={40}
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
        </div>
        <div className="card__footeer--mobile">
          <span className="movie__info">{descLength(desc)}</span>
          {rating ? (
            <a.Rate
              value={countStars(rating)}
              id={id}
              count={10}
              className="CardRate"
              allowHalf
              defaultValue={0}
              onChange={(value) => {
                ratingPost(value, id);
              }}
            />
          ) : (
            <a.Rate
              id={id}
              className="CardRate"
              count={10}
              allowHalf
              defaultValue={0}
              onChange={(value) => {
                ratingPost(value, id);
              }}
            />
          )}
        </div>
      </div>
    </li>
  );
};

export default Card;
