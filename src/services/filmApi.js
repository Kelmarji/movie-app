const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTk4YmNiZGM5NTY4ZDFjMmJlNDVmMGUxZmZiMDRhNyIsInN1YiI6IjY1ZTVkMGI3YTA1NWVmMDE2MzEyMDczZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7nvhnCAfqpCaeEsxc3Xfs3hJ42uWhnprRZK_VxeeAH4';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
};

export default async function filmsArr() {
  await fetch('https://api.themoviedb.org/3/movie/changes?page=2', options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

// fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
//   .then((response) => response.json())
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err));

//  poster https://image.tmdb.org/t/p/w185/${movie.poster_path}/oNRgfay17YoArHCikwakIPmQoep.jpg
