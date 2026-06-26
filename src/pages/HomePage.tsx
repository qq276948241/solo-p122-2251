import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import { useMovieFilter } from "@/hooks/useMovieFilter";

export default function HomePage() {
  const { totalCount, filteredCount, displayMovies } = useMovieFilter();

  return (
    <div className="min-h-screen bg-midnight-950">
      <Header />
      <main className="container py-8 animate-fade-in">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-midnight-100 mb-1">
              我的观影记录
            </h1>
            <p className="text-midnight-400 text-sm">
              已收藏{" "}
              <span className="text-amber-400 font-medium">{totalCount}</span>{" "}
              部电影，当前展示{" "}
              <span className="text-amber-400 font-medium">{filteredCount}</span>{" "}
              部
            </p>
          </div>
          <div className="hidden md:block font-serif italic text-midnight-500 text-sm">
            "电影是每秒二十四格的真理" ——戈达尔
          </div>
        </div>
        <MovieGrid movies={displayMovies} />
      </main>
      <footer className="border-t border-midnight-800 py-8 mt-12">
        <div className="container text-center text-midnight-500 text-sm">
          <p className="font-serif italic">深夜影话 · 记录每一次与光影的邂逅</p>
        </div>
      </footer>
    </div>
  );
}
