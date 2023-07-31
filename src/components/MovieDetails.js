import { useEffect, useRef, useState } from "react";
import RatingStar from "./RatingStar";
import Loader from "./Loader";
import { KEY } from "../App";
import { useKye } from "../hooks/useKye";

export default function MovieDetails({
  watched,
  movieID,
  onClose,
  onWatchMovie,
}) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const ratingDecisions = useRef(0);

  const isWatched = watched.map((w) => w.movieID).includes(movieID);
  const yourRating = watched?.find((w) => w.movieID === movieID)?.userRating;

  const {
    Title: title,
    Runtime: runtime,
    Released: released,
    Genre: genre,
    imdbRating,
    Poster: poster,
    Plot: plot,
    Actors: starring,
    Writer: writer,
  } = movie;

  function handleWatched() {
    const watchedMovie = {
      movieID: movieID,
      poster,
      title,
      imdbRating: imdbRating === "N/A" ? 0 : +imdbRating,
      runtime: Number(runtime?.split(" ").at(0))
        ? Number(runtime?.split(" ").at(0))
        : 0,
      userRating,
      rating: ratingDecisions.current,
    };
    onWatchMovie(watchedMovie);
    onClose(null);
  }

  useEffect(() => {
    userRating && ratingDecisions.current++;
  }, [userRating]);

  useEffect(() => {
    async function getMovie() {
      setLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?i=${movieID}&apikey=${KEY}`
      );
      const movie = await res.json();
      setMovie(movie);
      setLoading(false);
    }

    getMovie();
  }, [movieID]);

  useEffect(() => {
    if (!title) return;

    document.title = `MOVIE : ${title}`;

    return () => (document.title = "usePopcorn : MOBIN");
  }, [title]);

  useKye(onClose, "escape");

  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>

            <img src={poster} alt="" />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐ {imdbRating} IMDb rating</p>
            </div>
          </header>

          <div
            className="rating"
            style={{
              marginTop: "25px",
            }}
          >
            {!isWatched ? (
              <>
                {" "}
                <RatingStar
                  defaultRating={0}
                  maxRating={10}
                  size={20}
                  onMovieRating={setUserRating}
                />
                {userRating && (
                  <button onClick={handleWatched} className="btn-add">
                    + Add To List
                  </button>
                )}
              </>
            ) : (
              <p>
                You Rated With Movie {yourRating} <span>⭐</span>
              </p>
            )}
          </div>

          <section>
            <p>
              <em>{plot}</em>
            </p>

            <p>Starring {starring}</p>
            <p>Directed By {writer}</p>
          </section>
        </>
      )}
    </div>
  );
}
