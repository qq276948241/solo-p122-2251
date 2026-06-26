import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Users,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { useMovieStore } from "@/store/useMovieStore";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getMovieById = useMovieStore((s) => s.getMovieById);
  const deleteMovie = useMovieStore((s) => s.deleteMovie);

  const movie = id ? getMovieById(id) : undefined;

  if (!movie) {
    return (
      <div className="min-h-screen bg-midnight-950">
        <Header />
        <div className="container py-24 text-center">
          <p className="text-midnight-400 text-lg mb-4">未找到该电影</p>
          <button
            onClick={() => navigate("/")}
            className="text-amber-500 hover:text-amber-400 font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("确定要删除这条影评吗？")) {
      deleteMovie(movie.id);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950">
      <Header />

      {/* Hero 海报区 */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover blur-sm scale-110 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight-950/60 to-midnight-950" />
      </div>

      <main className="container -mt-[30vh] relative pb-16 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧海报 */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-28">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-2xl shadow-2xl border border-midnight-700 aspect-[2/3] object-cover"
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-midnight-800 text-midnight-200 hover:bg-midnight-700 border border-midnight-700 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/50 transition-all"
                  title="删除影评"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-midnight-50 leading-tight">
                    {movie.title}
                  </h1>
                  <StarRating rating={movie.rating} size={24} />
                </div>
              </div>

              {/* 类型标签 */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm border border-amber-500/30"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* 拍摄信息网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-midnight-800">
                {movie.year && (
                  <div className="flex items-center gap-2 text-midnight-300">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">{movie.year}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-2 text-midnight-300">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">{movie.runtime} 分钟</span>
                  </div>
                )}
                {movie.director && (
                  <div className="flex items-center gap-2 text-midnight-300">
                    <User className="w-4 h-4 text-amber-500" />
                    <span className="text-sm truncate" title={movie.director}>
                      {movie.director}
                    </span>
                  </div>
                )}
                {movie.cast && (
                  <div className="flex items-center gap-2 text-midnight-300">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span className="text-sm truncate" title={movie.cast}>
                      {movie.cast.split(" / ")[0]}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 详细信息 */}
            {(movie.director || movie.cast) && (
              <div className="bg-midnight-900/50 rounded-xl p-6 border border-midnight-800 space-y-3">
                {movie.director && (
                  <div className="flex gap-3">
                    <span className="text-midnight-500 text-sm shrink-0 w-16">导演</span>
                    <span className="text-midnight-200">{movie.director}</span>
                  </div>
                )}
                {movie.cast && (
                  <div className="flex gap-3">
                    <span className="text-midnight-500 text-sm shrink-0 w-16">主演</span>
                    <span className="text-midnight-200">{movie.cast}</span>
                  </div>
                )}
              </div>
            )}

            {/* 短评 */}
            <div className="border-l-2 border-amber-500 pl-6 py-2">
              <p className="font-serif italic text-xl text-midnight-200 leading-relaxed">
                "{movie.shortReview}"
              </p>
            </div>

            {/* 完整评论 */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-midnight-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-500 rounded-full" />
                完整影评
              </h2>
              <div className="font-serif text-midnight-200 text-lg leading-[1.9] whitespace-pre-line space-y-4">
                {movie.fullReview.split("\n\n").map((para, i) => (
                  <p key={i} className="indent-8">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
