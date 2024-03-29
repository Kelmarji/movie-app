export default class FilmApiService {
  apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTk4YmNiZGM5NTY4ZDFjMmJlNDVmMGUxZmZiMDRhNyIsInN1YiI6IjY1ZTVkMGI3YTA1NWVmMDE2MzEyMDczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7nvhnCAfqpCaeEsxc3Xfs3hJ42uWhnprRZK_VxeeAH4';

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    },
  };

  // eslint-disable-next-line class-methods-use-this
  async PostRating(value, filmId, sesId = '0959599ec631455f4858556b58c95a2d') {
    const postOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ value }),
    };

    fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${sesId}`, postOptions)
      .then((response) => response.json())
      .catch((err) => err.message);
  }

  apiBase = 'https://api.themoviedb.org/3';

  // genres for Context
  async getGenres() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', this.options);
    if (!res.ok) {
      throw new Error('Could not fetch');
    }

    const genres = await res.json();
    return genres;
  }

  // rated films
  async getRatedFilms(id) {
    const res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${id}/rated/movies?language=en-US&page=1&sort_by=created_at.asc&api_key=${this.apiKey}`,
      this.options
    );
    if (!res.ok) {
      // oshibka iz-za konchenogo API ))0), po etomy podojdem poka ok (p.s. iktdw);
      await res.ok;
    }

    const films = await res.json();
    return films;
  }

  async guestSession() {
    const guesId = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', this.options);

    const id = await guesId.json();
    return id;
  }

  // 1 film from ID
  async filmFromId(id) {
    const res = await fetch(`${this.apiBase}/movie/${id}?language=en-US`, this.options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${id}, received ${res.status}`);
    }

    const film = await res.json();
    return film;
  }

  // array films from ID
  async getfilmArrayFromId(page = 1, text = 'champlo') {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`,
      this.options
    );
    if (!response.ok) return 'ERROR';
    const data = await response.json();
    const filmPromises = data.results.map(({ id }) => {
      return this.filmFromId(id);
    });
    const films = await Promise.all(filmPromises);
    return films;
  }

  // array IDs
  async getFilmsIdArray(page = 1, text = 'return') {
    const response = await fetch(
      `${this.apiBase}/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`,
      this.options
    );
    const films = await response.json();
    return films;
  }

  // test connection
}
