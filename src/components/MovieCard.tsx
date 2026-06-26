import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types";
import StarRating from "./StarRating";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="masonry-item group cursor-pointer animate-fade-in"
    >
      <div className="relative overflow-hidden rounded-xl bg-midnight-800 card-glow transition-all duration-300 transform group-hover:-translate-y-1 border border-midnight-700">
        <div className="relative overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="poster-gradient absolute inset-0" />
          <div className="absolute top-3 right-3 bg-midnight-900/80 backdrop-blur-sm px-2 py-1 rounded-md border border-amber-500/30">
            <StarRating rating={movie.rating} size={12} showValue />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-display text-xl font-semibold text-midnight-100 group-hover:text-amber-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
            {movie.year && (
              <p className="text-xs text-midnight-400 font-medium">
                {movie.year}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {movie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2 py-0.5 rounded-full bg-midnight-700/60 text-amber-300/70 border border-midnight-600"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-sm text-midnight-300 italic line-clamp-3 leading-relaxed">
            "{movie.shortReview}"
          </p>
        </div>
      </div>
    </div>
  );
}
