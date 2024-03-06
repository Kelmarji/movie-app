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
    console.error(err);
    throw err;
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
    console.error(err);
    throw err;
  }
}

// `https://api.themoviedb.org/3/search/movie?include_adult=true&language=en-US&page=${page}` poisk
//  async function filmsArrFetch(page = 1) {
//   try {
//     const response = await fetch(`https://api.themoviedb.org/3/movie/changes?page=${page}`, options);
//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// async function filmsFromId(id) {
//   try {
//     const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
//     const film = await response.json();
//     return film;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// export async function filmsArr() {
//   await fetch('https://api.themoviedb.org/3/movie/changes?page=2', options)
//     .then((response) => response.json())
//     .then((response) => console.log(response))
//     .catch((err) => console.error(err));
// }

// fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
//   .then((response) => response.json())
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err));

// //  poster https://image.tmdb.org/t/p/w185/${movie.poster_path}/oNRgfay17YoArHCikwakIPmQoep.jpg

// export async function filmsFromId(IdArr) {
//   IdArr.map((item) => {
//     fetch(`https://api.themoviedb.org/3/movie/${item.id}?language=en-US`, options)
//       .then((response) => response.json())
//       .then((response) => console.log(response))
//       .catch((err) => console.error(err));
//   });
// }

// export default filmApi;
