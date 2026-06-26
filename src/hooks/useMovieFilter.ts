import { useMemo } from "react";
import {
  useMovieStore,
  filterMovies,
  sortMovies,
  type SortBy,
} from "@/store/useMovieStore";
import type { Movie } from "@/types";

export interface UseMovieFilterResult {
  totalCount: number;
  filteredCount: number;
  displayMovies: Movie[];
  searchQuery: string;
  selectedGenre: string | null;
  sortBy: SortBy;
}

export function useMovieFilter(): UseMovieFilterResult {
  const movies = useMovieStore((s) => s.movies);
  const searchQuery = useMovieStore((s) => s.searchQuery);
  const selectedGenre = useMovieStore((s) => s.selectedGenre);
  const sortBy = useMovieStore((s) => s.sortBy);

  const filteredMovies = useMemo(
    () => filterMovies(movies, searchQuery, selectedGenre),
    [movies, searchQuery, selectedGenre]
  );

  const displayMovies = useMemo(
    () => sortMovies(filteredMovies, sortBy),
    [filteredMovies, sortBy]
  );

  return {
    totalCount: movies.length,
    filteredCount: filteredMovies.length,
    displayMovies,
    searchQuery,
    selectedGenre,
    sortBy,
  };
}
