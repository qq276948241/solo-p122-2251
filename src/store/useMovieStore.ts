import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/types";
import { mockMovies } from "@/data/mockMovies";

export type SortBy = "rating" | "recent" | "title";

interface MovieState {
  movies: Movie[];
  searchQuery: string;
  selectedGenre: string | null;
  sortBy: SortBy;
  addMovie: (movie: Omit<Movie, "id" | "createdAt">) => void;
  deleteMovie: (id: string) => void;
  getMovieById: (id: string) => Movie | undefined;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string | null) => void;
  setSortBy: (sort: SortBy) => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      movies: mockMovies,
      searchQuery: "",
      selectedGenre: null,
      sortBy: "recent",

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

      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: "movie-review-storage",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as object),
        sortBy: (persistedState as { sortBy?: SortBy })?.sortBy ?? currentState.sortBy,
      }),
      partialize: (state) => ({
        movies: state.movies,
        searchQuery: state.searchQuery,
        selectedGenre: state.selectedGenre,
        sortBy: state.sortBy,
      }),
    }
  )
);

export function filterMovies(
  movies: Movie[],
  searchQuery: string,
  selectedGenre: string | null
): Movie[] {
  if (!Array.isArray(movies)) return [];
  return movies.filter((movie) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === null || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });
}

export function sortMovies(movies: Movie[], sortBy: SortBy): Movie[] {
  if (!Array.isArray(movies)) return [];
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
