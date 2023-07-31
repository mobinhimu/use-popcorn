import { useState } from "react";

export default function RatingStar({
  maxRating = 5,
  color = "#FFE008",
  size = 16,
  defaultRating,
  messages = [],
  onMovieRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [mouseOver, setMouseOver] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        fontSize: size,
      }}
    >
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          rating={mouseOver ? mouseOver >= i + 1 : rating >= i + 1}
          onRate={() => {
            setRating(i + 1);
            onMovieRating(i + 1);
          }}
          onMouseOver={() => setMouseOver(i + 1)}
          onMouseLeave={() => setMouseOver(0)}
          color={color}
          size={size}
        />
      ))}

      <p style={{ color: color }}>
        {messages.length !== maxRating
          ? mouseOver || rating
          : messages[mouseOver ? mouseOver - 1 : rating - 1]}
      </p>
    </div>
  );
}

function Star({ rating, onRate, onMouseOver, onMouseLeave, color, size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={rating ? color : "none"}
      stroke={color}
      onClick={onRate}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseLeave}
      style={{
        height: `${size}px`,
        cursor: "pointer",
      }}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
