const SearchContent = () => {
    return (
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
          total={Totalpages}
          pageSize={20}
          showSizeChanger={false}
          onChange={(e) => this.changePage(e)}
        />
      </div>
    );
  };
  // RatedTab
  if (tab === 'Rated') {
    return (
      <div>
        <Online>
          <SearchContent />
        </Online>
        <Offed />
      </div>
    );
  }

  // if input empty
  if (!films.length && !conLost) {
    return (
      <div>
        <Online>
          <EmptyInput />
        </Online>
        <Offed />
      </div>
    );
  }
  // SearchTab
  return (
    <div>
      <Online>
        <SearchContent />
      </Online>
      <Offed />
    </div>
  );
}