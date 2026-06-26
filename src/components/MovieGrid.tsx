import { useMemo } from "react";
import type { Movie } from "@/types";
import type { SortBy } from "@/store/useMovieStore";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  filteredMovies: Movie[];
  sortBy: SortBy;
}

function sortMovies(movies: Movie[], sortBy: SortBy): Movie[] {
  if (movies.length <= 1) return movies;

  const sorted = [...movies];

  switch (sortBy) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "recent":
      return sorted.sort((a, b) => b.createdAt - a.createdAt);

    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));

    default:
      return sorted;
  }
}

export default function MovieGrid({ filteredMovies, sortBy }: MovieGridProps) {
  const sortedMovies = useMemo(
    () => sortMovies(filteredMovies, sortBy),
    [filteredMovies, sortBy]
  );

  if (sortedMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-midnight-400 text-lg">没有找到符合条件的电影</p>
        <p className="text-midnight-500 text-sm mt-1">尝试其他关键词或类型</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {sortedMovies.map((movie, index) => (
        <div
          key={movie.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-slide-up"
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
