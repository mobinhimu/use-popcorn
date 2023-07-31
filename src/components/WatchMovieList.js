import WatchedMovie from "./WatchedMovie";

export default function WatchMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.movieID} onDelete={onDelete} />
      ))}
    </ul>
  );
}
