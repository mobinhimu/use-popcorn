import { useRef } from "react";
import { useKye } from "../hooks/useKye";

export default function Search({ query, setQuery }) {
  const searchInput = useRef(null);

  useKye(() => {
    if (document.activeElement === searchInput.current) return;

    searchInput.current.focus();
    setQuery("");
  }, "enter");

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={searchInput}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
