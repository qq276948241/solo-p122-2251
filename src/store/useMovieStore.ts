import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/types";
import { mockMovies } from "@/data/mockMovies";

interface MovieState {
  movies: Movie[];
  searchQuery: string;
  selectedGenre: string | null;
  addMovie: (movie: Omit<Movie, "id" | "createdAt">) => void;
  deleteMovie: (id: string) => void;
  getMovieById: (id: string) => Movie | undefined;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string | null) => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      movies: mockMovies,
      searchQuery: "",
      selectedGenre: null,

      addMovie: (movieData) =>
        set((state) => ({
          movies: [
            {
              ...movieData,
              id: Date.now().toString(),
              createdAt: Date.now(),
            },
            ...state.movies,
          ],
        })),

      deleteMovie: (id) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== id),
        })),

      getMovieById: (id) => get().movies.find((m) => m.id === id),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedGenre: (genre) => set({ selectedGenre: genre }),
    }),
    {
      name: "movie-review-storage",
    }
  )
);

export function filterMovies(
  movies: Movie[],
  searchQuery: string,
  selectedGenre: string | null
) {
  return movies.filter((movie) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === null || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });
}
