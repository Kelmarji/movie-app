/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { Online, Offline } from 'react-detect-offline';
import * as antd from 'antd';

import FilmApiService from '../../services/filmApi-service';
import './App.css';
import MovieList from '../MovieList';

const filmApi = new FilmApiService();

export const App = () => {
  const [films, setFilms] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(501);
  const [conLost, setConLost] = useState(false);
  const [errTxt, setErrTxt] = useState('Error');

  const Alert = () => {
    return <antd.Alert message="Error" description={`Ops,${errTxt}`} type="error" showIcon />;
  };
  const Loading = () => {
    return (
      <ul key="uniqueKey" className="movie__list unloaded__movie__list">
        <div className="loading__card">{conLost ? <Alert className="error" /> : <antd.Spin size="large" />}</div>
      </ul>
    );
  };

  const getFilms = async () => {
    await filmApi
      .getfilmArrayFromId(page, 'return')
      .then((body) => {
        if (body === 'ERROR') {
          setLoaded(false);
          throw new Error('something Wrong');
        }
        setFilms(body);
        setConLost(false);
        setLoaded(true);
      })
      .catch((err) => {
        setErrTxt(err.message);
        setConLost(true);
      });
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
    <div>
      <Online>
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
      </Online>
      <Offline className="offline">
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
          <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
          <antd.Pagination total={50} onChange={(e) => changePage(e)} />
        </div>
      </Offline>
    </div>
  );
};

export default App;
