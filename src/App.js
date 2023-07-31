import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import Result from "./components/Result";
import Main from "./components/Main";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import WatchedSummary from "./components/WatchedSummary";
import WatchMovieList from "./components/WatchMovieList";
import MovieDetails from "./components/MovieDetails";
import { useMovieFetch } from "./hooks/useMovieFetch";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export const KEY = "c34c67dd";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movieID, setMovieID] = useState(null);

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalStorageState("watched");

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

  const { movies, error, loading } = useMovieFetch(query);

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
