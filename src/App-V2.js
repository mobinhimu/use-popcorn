import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { Result } from "./Result";
import { Main } from "./Main";
import { Box } from "./components/Box";
import { MovieList } from "./MovieList";
import { WatchedSummary } from "./WatchedSummary";
import { WatchMovieList } from "./WatchMovieList";
import { MovieDetails } from "./MovieDetails";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

export const KEY = "c34c67dd";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [movieID, setMovieID] = useState(null);

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() => {
    return JSON.parse(localStorage.getItem("watched"));
  });

  function handleMovieID(id) {
    setMovieID((prevID) => (id === prevID ? null : id));
  }

  function closeHandle() {
    setMovieID(null);
  }

  function watchedMovie(newWatched) {
    setWatched((watched) => [...watched, newWatched]);
  }

  function handleDelete(movieID) {
    setWatched((watched) => watched.filter((w) => w.movieID !== movieID));
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify([...watched]));
  }, [watched]);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchingData() {
        try {
          setError("");
          setLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something Went Wrong , Please Try Again Later");

          const movie = await res.json();

          if (movie.Response === "False") throw new Error("Movie Not Found");

          setLoading(false);
          setMovies(movie.Search);
          setError("");
        } catch (error) {
          if (error.message !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setLoading(false);
        }
      }

      if (query.length < 2) {
        setError("");
        setLoading("");
        return;
      }

      fetchingData();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(() => {
    document.title = "usePopcorn : MOBIN";
  }, []);

  return (
    <>
      <NavBar>
        <Search movies={movies} query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {loading && <Loader />}
          {!loading && !error && (
            <MovieList movies={movies} onMovieID={handleMovieID} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {movieID ? (
            <MovieDetails
              onWatchMovie={watchedMovie}
              movieID={movieID}
              onClose={closeHandle}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchMovieList
                watched={watched}
                movieID={movieID}
                onDelete={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
