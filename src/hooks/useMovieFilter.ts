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
  const movies = useMovieStore((s) => s.movies) ?? [];
  const searchQuery = useMovieStore((s) => s.searchQuery) ?? "";
  const selectedGenre = useMovieStore((s) => s.selectedGenre) ?? null;
  const sortBy = useMovieStore((s) => s.sortBy) ?? "recent";

  const safeMovies = Array.isArray(movies) ? movies : [];

  const filteredMovies = useMemo(
    () => filterMovies(safeMovies, searchQuery, selectedGenre),
    [safeMovies, searchQuery, selectedGenre]
  );

  const displayMovies = useMemo(
    () => sortMovies(filteredMovies, sortBy),
    [filteredMovies, sortBy]
  );

  const safeDisplay = Array.isArray(displayMovies) ? displayMovies : [];
  const safeFiltered = Array.isArray(filteredMovies) ? filteredMovies : [];

  return {
    totalCount: safeMovies.length,
    filteredCount: safeFiltered.length,
    displayMovies: safeDisplay,
    searchQuery,
    selectedGenre,
    sortBy,
  };
}
