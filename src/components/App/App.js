import React, { Component } from 'react';
import { Online, Offline } from 'react-detect-offline';
import * as antd from 'antd';
import _ from 'lodash';

import { MovieAppProvider } from '../MovieAppContextService/MovieAppContextService';
import FilmApiService from '../../services/filmApi-service';
import './App.css';
import MovieList from '../MovieList';

const filmApi = new FilmApiService();

const mergeArrays = (arr1, arr2) => {
  const mergedArray = [...arr1];

  arr2.forEach((obj2) => {
    const matchingIndex = mergedArray.findIndex((obj1) => obj1.id === obj2.id);
    if (matchingIndex !== -1) {
      mergedArray[matchingIndex] = { ...mergedArray[matchingIndex], ...obj2 };
    } else {
      mergedArray.push(obj2);
    }
  });

  return mergedArray;
};

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
    ratedPages: 1,
    genres: [],
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
    if (!this.state.sessionId) {
      await filmApi.guestSession().then(async (body) => {
        await this.setState({ sessionId: body.guest_session_id });
      });
    }

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

    await filmApi
      .getRatedFilms(this.state.sessionId)
      .then((body) => {
        this.setState({ ratedPages: body.total_results });
        const ratedFilms = body.results;
        if (body === 'ERROR') {
          this.setState({ loaded: false });
          throw new Error('something Wrong');
        }
        this.setState({ ratedFilms, conLost: false, loaded: true });
      })
      .catch((err) => {
        this.setState({ errTxt: err.message, conLost: true });
      });

    this.setState({ films: mergeArrays(this.state.films, this.state.ratedFilms) });
  };

  changePage = (num = 1) => {
    this.setState({ page: num });
    this.getFilms(num);
    this.setState({ loaded: false });
  };

  changeSearch = _.debounce((text) => {
    this.setState({ searchText: text });
    this.setState({ page: 1 });
    this.getFilms(this.state.page, text);
    this.setState({ loaded: false });
  }, 2000);

  pageSetter = (num) => this.setState({ page: num });

  getGenres = async () => {
    const { genres } = await filmApi.getGenres();
    this.setState({ genres });
  };

  changeTab = async (str) => {
    if (str === 'Search') {
      this.setState({ tab: 'Search' });
    } else {
      await filmApi.getRatedFilms(this.state.sessionId).then((body) => this.setState({ ratedFilms: body.results }));
      this.setState({ tab: 'Rated' });
    }
  };

  rater = async (value, filmId) => {
    filmApi.PostRating(value, filmId, this.state.sessionId);
    await filmApi.getRatedFilms(this.state.sessionId).then((body) => this.setState({ ratedFilms: body.results }));
    this.setState({ films: mergeArrays(this.state.ratedFilms, this.state.films) });
  };

  async componentDidMount() {
    this.getGenres();
    this.getFilms(this.state.page, this.state.search);
  }

  componentDidCatch(err) {
    this.setState({ errTxt: err.me, conLost: true });
  }

  render() {
    const { films, loaded, pages, conLost, tab, ratedFilms, ratedPages, page } = this.state;
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
              <MovieAppProvider value={this.state.genres}>
                {loaded ? <MovieList ratingPost={this.rater} filmsList={ratedFilms} tab={tab} /> : <this.Loading />}
              </MovieAppProvider>
              <antd.Pagination
                current={page}
                defaultActiveKey={1}
                total={ratedPages}
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
              <antd.Pagination current={page} className="Footer" total={1} onChange={(e) => this.changePage(e)} />
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
                  onChange={(e) => {
                    this.changeSearch(e.target.value);
                    this.pageSetter(1);
                  }}
                  size={'Large'}
                />
              </div>
              <antd.Alert type="success" message={`Hello ${'guest'}`} description="input film name to search ;)" />
              <antd.Pagination
                current={page}
                defaultActiveKey={page}
                total={1}
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
                <antd.Input
                  placeholder="type to search..."
                  className="input-size"
                  onChange={(e) => {
                    this.changeSearch(e.target.value);
                    this.pageSetter(1);
                  }}
                  size={'Large'}
                />
              </div>
              <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
              <antd.Pagination
                current={page}
                defaultActiveKey={page}
                className="Footer"
                total={1}
                onChange={(e) => this.changePage(e)}
              />
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
                onChange={(e) => {
                  this.changeSearch(e.target.value);
                  this.pageSetter(1);
                }}
                size={'Large'}
              />
            </div>
            <MovieAppProvider value={this.state.genres}>
              {loaded ? <MovieList ratingPost={this.rater} filmsList={films} tab={tab} /> : <this.Loading />}
            </MovieAppProvider>
            <antd.Pagination
              current={page}
              defaultActiveKey={this.state.page}
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
              <antd.Input
                placeholder="type to search..."
                className="input-size"
                onChange={(e) => {
                  this.changeSearch(e.target.value);
                  this.pageSetter(1);
                }}
                size={'Large'}
              />
            </div>
            <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
            <antd.Pagination current={page} className="Footer" total={1} onChange={(e) => this.changePage(e)} />
          </div>
        </Offline>
      </div>
    );
  }
}
