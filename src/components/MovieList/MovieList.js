import React, { ReactDOM } from 'react';

import './MovieList.css';
import Card from '../Card';

const myvis = [
  { name: 'hehe1' },
  { name: 'hehe2' },
  { name: 'hehe3' },
  { name: 'hehe4' },
  { name: 'hehe5' },
  { name: 'hehe6' },
];

const films = myvis.map(({ name }) => {
  return <Card label={name} />;
});
console.log(films);
export const MovieList = () => {
  return <ul className="movie__list">{films}</ul>;
};
