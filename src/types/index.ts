export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  genres: string[];
  rating: number;
  shortReview: string;
  fullReview: string;
  director?: string;
  cast?: string;
  year?: number;
  runtime?: number;
  createdAt: number;
}

export const ALL_GENRES = [
  "动作",
  "科幻",
  "剧情",
  "悬疑",
  "爱情",
  "动画",
  "喜剧",
  "恐怖",
  "纪录片",
] as const;

export type Genre = (typeof ALL_GENRES)[number];
