import React from 'react';
import * as a from 'antd';

import filmArray from '../../services/filmApi';
import './App.css';
import MovieList from '../MovieList';

const films = await filmArray(1, 'return');

export const App = () => {
  return (
    <div className="App">
      <a.Flex vertical justify="space-around">
        <a.Input size={'large'} />
        <MovieList filmsList={films}></MovieList>
      </a.Flex>
    </div>
  );
};

export default App;
