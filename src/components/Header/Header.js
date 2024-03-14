import React from 'react';
import * as antd from 'antd';
import './Header.css';

const Header = (props) => {
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
  const { change } = props;
  return (
    <div className="Header">
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
      <antd.Input
        placeholder="type to search..."
        className="input-size"
        onChange={(e) => change(e.target.value)}
        size={'Large'}
      />
    </div>
  );
};

export default Header;
