import React from 'react';
import './Card.css';
import { format } from 'date-fns';

const genresArr = (arr = [{ id: 1, name: 'Ohae' }]) => {
  return arr.map(({ id = 0, name = 'err' }) => {
    return (
      <li key={id} className="marked">
        {name}
      </li>
    );
  });
};

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
        <ul className="card__theme">{genresArr(genres)}</ul>
        <span className="movie__info">{descLength(desc)}</span>
      </div>
    </li>
  );
};

export default Card;
