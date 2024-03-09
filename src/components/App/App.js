import React from 'react';
import * as antd from 'antd';

import filmArray from '../../services/filmApi';
import './App.css';
import MovieList from '../MovieList';

const films = await filmArray(1, 'return');

export const App = () => {
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
      <MovieList filmsList={films}></MovieList>
      <antd.Pagination total={50} />
    </div>
  );
};

export default App;
