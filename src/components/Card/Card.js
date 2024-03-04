import React from 'react';
import './Card.css';

export default function Card(props) {
  return (
    <li className="movie__card">
      <div className="card__image">
        <img className="cardImg" src="https://image.tmdb.org/t/p/w185/oNRgfay17YoArHCikwakIPmQoep.jpg" />
      </div>
      <div className="card__info">
        <h1 className="card__name">{props.label}</h1>
        <span className="card__time">March 5, 2020 </span>
        <span className="cart__theme">Action Drama</span>
        <span className="movie__info">
          A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction
          attempts to regain his soul and salvation by becoming the coach of a disparate ethnically mixed high ...
        </span>
      </div>
    </li>
  );
}
