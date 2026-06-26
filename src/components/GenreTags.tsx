import { ALL_GENRES } from "@/types";
import { useMovieStore } from "@/store/useMovieStore";

export default function GenreTags() {
  const selectedGenre = useMovieStore((state) => state.selectedGenre);
  const setSelectedGenre = useMovieStore((state) => state.setSelectedGenre);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedGenre(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedGenre === null
            ? "bg-amber-500 text-midnight-900 shadow-lg shadow-amber-500/20"
            : "bg-midnight-800 text-midnight-300 hover:bg-midnight-700 border border-midnight-700 hover:border-amber-500/30"
        }`}
      >
        全部
      </button>
      {ALL_GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => setSelectedGenre(genre)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedGenre === genre
              ? "bg-amber-500 text-midnight-900 shadow-lg shadow-amber-500/20"
              : "bg-midnight-800 text-midnight-300 hover:bg-midnight-700 border border-midnight-700 hover:border-amber-500/30"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
