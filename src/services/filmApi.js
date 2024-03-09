const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTk4YmNiZGM5NTY4ZDFjMmJlNDVmMGUxZmZiMDRhNyIsInN1YiI6IjY1ZTVkMGI3YTA1NWVmMDE2MzEyMDczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7nvhnCAfqpCaeEsxc3Xfs3hJ42uWhnprRZK_VxeeAH4',
  },
};

async function filmsFromId(id) {
  try {
    const filmOnId = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
    const film = await filmOnId.json();
    return film;
  } catch (err) {
    throw new Error(err);
  }
}

export default async function filmArray(page, text = 'return') {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`,
      options
    );
    const data = await response.json();
    const filmPromises = data.results.map(({ id }) => {
      return filmsFromId(id);
    });
    const films = await Promise.all(filmPromises);
    return films;
  } catch (err) {
    throw new Error(err);
  }
}
