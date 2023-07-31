import { useEffect, useState } from "react";
import { KEY } from "../App";

export function useMovieFetch(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [query]);

  return { movies, loading, error };
}
