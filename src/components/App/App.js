import React, { Component } from 'react';
import { Online, Offline } from 'react-detect-offline';
import * as antd from 'antd';
import _ from 'lodash';

import FilmApiService from '../../services/filmApi-service';
import './App.css';
import MovieList from '../MovieList';

const filmApi = new FilmApiService();

export default class App extends Component {
  state = {
    tab: 'Search',
    films: [],
    ratedFilms: [],
    sessionId: '',
    loaded: false,
    page: 1,
    searchText: 'return',
    conLost: false,
    errTxt: 'erroredishe',
    pages: 1,
  };

  items = [
    {
      key: 'Search',
      label: 'Search',
    },
    {
      key: 'Rated',
      label: 'Rated',
    },
  ];

  Loading = () => {
    return (
      <ul key="uniqueKey" className="movie__list unloaded__movie__list">
        <div className="loading__card">
          {this.state.conLost ? <this.Alert className="error" /> : <antd.Spin size="large" />}
        </div>
      </ul>
    );
  };

  Alert = () => {
    return <antd.Alert message="Error" description={`Ops,${this.state.errTxt}`} type="error" showIcon />;
  };

  getFilms = async (p = this.state.page, search = this.state.searchText) => {
    console.log(this.state.sessionId); //  del when commit
    await filmApi
      .getFilmsIdArray(p, search)
      .then((count) => this.setState({ pages: count.total_results }))
      .catch((err) => {
        this.setState({ errTxt: err.me, conLost: true });
      });
    await filmApi
      .getfilmArrayFromId(p, search)
      .then((body) => {
        const films = body;
        if (body === 'ERROR') {
          this.setState({ loaded: false });
          throw new Error('something Wrong');
        }
        this.setState({ films, conLost: false, loaded: true });
      })
      .catch((err) => {
        this.setState({ errTxt: err.message, conLost: true });
      });

    if (!this.state.sessionId) {
      await filmApi.guestSession().then((body) => {
        this.setState({ sessionId: body.guest_session_id });
      });
    }
  };

  changePage = (num = 1) => {
    console.log(this.state.tab);
    this.setState({ page: num });
    this.getFilms(num);
    this.setState({ loaded: false });
  };

  changeSearch = _.debounce((text = 'return') => {
    this.setState({ page: 1 });
    this.setState({ searchText: text });
    this.getFilms(this.state.page, text);
    this.setState({ loaded: false });
  }, 2000);

  changeTab = (str) => (str === 'Search' ? this.setState({ tab: 'Search' }) : this.setState({ tab: 'Rated' }));

  componentDidMount() {
    this.getFilms(1, 'return');
  }

  componentDidCatch(err) {
    this.setState({ errTxt: err.me, conLost: true });
  }

  render() {
    const { films, loaded, pages, conLost, tab, ratedFilms } = this.state;
    if (tab === 'Rated') {
      return (
        <div>
          <Online>
            <div className="App">
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
                  <antd.Tabs defaultActiveKey="2" items={this.items} onChange={(e) => this.changeTab(e)} />
                </antd.ConfigProvider>
              </div>
              {loaded ? <MovieList filmsList={ratedFilms} /> : <this.Loading />}
              <antd.Pagination
                total={pages}
                pageSize={20}
                showSizeChanger={false}
                onChange={(e) => this.changePage(e)}
              />
              ;
            </div>
          </Online>
          <Offline className="offline">
            <div className="App">
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
                  <antd.Tabs defaultActiveKey="1" items={this.items} onChange={(e) => this.changeTab(e)} />
                </antd.ConfigProvider>
              </div>
              <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
              <antd.Pagination className="Footer" total={1} onChange={(e) => this.changePage(e)} />
            </div>
          </Offline>
        </div>
      );
    }
    if (!films.length && !conLost) {
      return (
        <div>
          <Online>
            <div className="App">
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
                  <antd.Tabs defaultActiveKey="1" items={this.items} onChange={(e) => this.changeTab(e)} />
                </antd.ConfigProvider>
                <antd.Input
                  placeholder="type to search..."
                  className="input-size"
                  onChange={(e) => this.changeSearch(e.target.value)}
                  size={'Large'}
                />
              </div>
              <antd.Alert type="success" message={`Hello ${'guest'}`} description="input film name to search ;)" />
              <antd.Pagination total={1} pageSize={20} showSizeChanger={false} onChange={(e) => this.changePage(e)} />;
            </div>
          </Online>
          <Offline className="offline">
            <div className="App">
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
                  <antd.Tabs defaultActiveKey="1" items={this.items} onChange={(e) => this.changeTab(e)} />
                </antd.ConfigProvider>
                <antd.Input
                  placeholder="type to search..."
                  className="input-size"
                  onChange={(e) => this.changeSearch(e.target.value)}
                  size={'Large'}
                />
              </div>
              <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
              <antd.Pagination className="Footer" total={1} onChange={(e) => this.changePage(e)} />
            </div>
          </Offline>
        </div>
      );
    }
    return (
      <div>
        <Online>
          <div className="App">
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
                <antd.Tabs defaultActiveKey="1" items={this.items} onChange={(e) => this.changeTab(e)} />
              </antd.ConfigProvider>
              <antd.Input
                placeholder="type to search..."
                className="input-size"
                onChange={(e) => this.changeSearch(e.target.value)}
                size={'Large'}
              />
            </div>
            {loaded ? <MovieList filmsList={films} /> : <this.Loading />}
            <antd.Pagination total={pages} pageSize={20} showSizeChanger={false} onChange={(e) => this.changePage(e)} />
            ;
          </div>
        </Online>
        <Offline className="offline">
          <div className="App">
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
                <antd.Tabs defaultActiveKey="1" items={this.items} onChange={(e) => this.changeTab(e)} />
              </antd.ConfigProvider>
              <antd.Input
                placeholder="type to search..."
                className="input-size"
                onChange={(e) => this.changeSearch(e.target.value)}
                size={'Large'}
              />
            </div>
            <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
            <antd.Pagination className="Footer" total={1} onChange={(e) => this.changePage(e)} />
          </div>
        </Offline>
      </div>
    );
  }
}
