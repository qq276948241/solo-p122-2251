import type { Movie } from "@/types";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  filteredMovies: Movie[];
}

export default function MovieGrid({ filteredMovies }: MovieGridProps) {
  if (filteredMovies.length === 0) {
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
      {filteredMovies.map((movie, index) => (
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
