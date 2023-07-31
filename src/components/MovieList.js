import  Movie  from "./Movie";

export default function MovieList({ movies, onMovieID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onMovieID={onMovieID} />
      ))}
    </ul>
  );
}
