import React from "react";


interface Book {
  id: string;
  author: string;
  title: string;
  imageLink: string;
  subscriptionRequired: boolean;
  averageRating: number; // e.g., 4.3
}

interface BookCardProps {
  book: Book;
}

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.388 2.46c-.784.57-1.838-.196-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L3.607 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
  </svg>
);

export default function BookCard({ book }: BookCardProps) {
  const { title, author, imageLink, subscriptionRequired, averageRating } = book;

  // Round rating to nearest half star
  const stars = [];
  const roundedRating = Math.round(averageRating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<Star key={i} filled={true} />);
    } else if (i - 0.5 === roundedRating) {
      // half star: could add an SVG for half star, but for simplicity, treat as filled
      stars.push(<Star key={i} filled={true} />);
    } else {
      stars.push(<Star key={i} filled={false} />);
    }
  }

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer">
      {/* Book Image */}
      <img
        src={imageLink}
        alt={`Cover of ${title}`}
        className="w-full h-48 object-cover rounded-t-lg"
        loading="lazy"
      />

      {/* Premium pill */}
      {subscriptionRequired && (
        <span className="absolute top-2 right-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
          Premium
        </span>
      )}

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 truncate" title={title}>
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-600 truncate" title={author}>
          {author}
        </p>

        {/* Rating Stars */}
        <div className="mt-2 flex space-x-0.5">{stars}</div>
      </div>
    </div>
  );
}
