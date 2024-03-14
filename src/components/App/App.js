import React, { Component } from 'react';
import { Online, Offline } from 'react-detect-offline';
import * as antd from 'antd';
import _ from 'lodash';

import FilmApiService from '../../services/filmApi-service';
import './App.css';
import MovieList from '../MovieList';
import Header from '../Header';

const filmApi = new FilmApiService();

export default class App extends Component {
  state = {
    films: [],
    loaded: false,
    page: 1,
    searchText: 'return',
    conLost: false,
    errTxt: 'erroredishe',
    pages: 1,
  };

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
    await filmApi.getFilmsIdArray(p, search).then((count) => this.setState({ pages: count.total_results }));
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
  };

  changePage = (num = 1) => {
    console.log(num);
    this.setState({ page: num });
    this.getFilms(num);
    this.setState({ loaded: false });
  };

  changeSearch = (text = 'test') => {
    _.debounce(() => {
      this.setState({ searchText: text });
      this.getFilms(this.state.page, text);
      this.setState({ loaded: false });
    }, 2000)();
  };

  componentDidMount() {
    this.getFilms();
  }

  render() {
    const { films, loaded, pages } = this.state;
    if (!films.length) {
      return (
        <div>
          <Online>
            <div className="App">
              <Header change={this.changeSearch} />
              <antd.Alert type="warning" message="Ops" description="Sorry, we can't find this films" />
              <antd.Pagination total={1} pageSize={20} showSizeChanger={false} onChange={(e) => this.changePage(e)} />;
            </div>
          </Online>
          <Offline className="offline">
            <div className="App">
              <Header />
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
            <Header change={this.changeSearch} />
            {loaded ? <MovieList filmsList={films} /> : <this.Loading />}
            <antd.Pagination total={pages} pageSize={20} showSizeChanger={false} onChange={(e) => this.changePage(e)} />
            ;
          </div>
        </Online>
        <Offline className="offline">
          <div className="App">
            <Header />
            <antd.Alert message="Error" description={'Ops, lost connection...'} type="error" showIcon />
            <antd.Pagination className="Footer" total={1} onChange={(e) => this.changePage(e)} />
          </div>
        </Offline>
      </div>
    );
  }
}
