import React, { useState, useEffect } from 'react';
import * as antd from 'antd';

import FilmApiService from '../../services/filmApi-service';
import './App.css';
import MovieList from '../MovieList';

const filmApi = new FilmApiService();

export const App = () => {
  const Loading = () => {
    return (
      <ul key="uniqueKey" className="movie__list unloaded__movie__list">
        <div className="loading__card">
          <antd.Spin size="large" />
        </div>
      </ul>
    );
  };

  const [films, setFilms] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);

  const getFilms = async () => {
    const filmsData = await filmApi.getfilmArrayFromId(page, 'return');
    setFilms(filmsData);
    setLoaded(true);
  };

  useEffect(() => {
    getFilms();
  }, []);

  const changePage = (num) => {
    setPage(num);
    setLoaded(false);
    getFilms();
  };

  const items = [
    {
      key: '1',
      label: 'Search',
    },
    {
      key: '2',
      label: 'Rated',
    },
  ];

  return (
    <div className="App">
      <antd.ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemHoverColor: 'yellow',
              itemActiveColor: 'yellow',
              inkBarColor: 'yellow',
              itemSelectedColor: 'black',
              colorBorderSecondary: 'white',
              /* here is your component tokens */
            },
          },
        }}
      >
        <antd.Tabs defaultActiveKey="1" items={items} />
      </antd.ConfigProvider>
      <antd.Input placeholder="type to search..." className="input-size" size={'Large'} />
      {loaded ? <MovieList filmsList={films} /> : <Loading />}
      <antd.Pagination total={50} onChange={(e) => changePage(e)} />
    </div>
  );
};

export default App;
