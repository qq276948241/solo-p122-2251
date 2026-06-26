import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Star, Image } from "lucide-react";
import Header from "@/components/Header";
import { ALL_GENRES } from "@/types";
import { useMovieStore } from "@/store/useMovieStore";

export default function AddMoviePage() {
  const navigate = useNavigate();
  const addMovie = useMovieStore((s) => s.addMovie);

  const [form, setForm] = useState({
    title: "",
    posterUrl: "",
    genres: [] as string[],
    rating: 7,
    shortReview: "",
    fullReview: "",
    director: "",
    cast: "",
    year: "",
    runtime: "",
  });

  const [previewError, setPreviewError] = useState(false);

  const updateField = (key: string, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleGenre = (genre: string) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("请输入电影名称");
      return;
    }
    if (!form.posterUrl.trim()) {
      alert("请输入海报链接");
      return;
    }
    if (form.genres.length === 0) {
      alert("请至少选择一个类型");
      return;
    }
    if (!form.shortReview.trim()) {
      alert("请输入一句话短评");
      return;
    }
    if (!form.fullReview.trim()) {
      alert("请输入完整影评");
      return;
    }

    addMovie({
      title: form.title.trim(),
      posterUrl: form.posterUrl.trim(),
      genres: form.genres,
      rating: form.rating,
      shortReview: form.shortReview.trim(),
      fullReview: form.fullReview.trim(),
      director: form.director.trim() || undefined,
      cast: form.cast.trim() || undefined,
      year: form.year ? parseInt(form.year) : undefined,
      runtime: form.runtime ? parseInt(form.runtime) : undefined,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-midnight-950">
      <Header />

      <main className="container py-8 animate-fade-in">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-midnight-400 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>

        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-midnight-50 mb-2">
            录入新片
          </h1>
          <p className="text-midnight-400 mb-8">
            记录一次与光影的邂逅，让它永远留在你的深夜影院里
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-midnight-900/50 rounded-2xl border border-midnight-800 p-6 md:p-8 space-y-6"
          >
            {/* 海报预览 */}
            {form.posterUrl && !previewError && (
              <div className="flex justify-center">
                <img
                  src={form.posterUrl}
                  alt="海报预览"
                  className="max-h-64 rounded-lg shadow-lg border border-midnight-700 object-cover"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
            {form.posterUrl && previewError && (
              <div className="flex justify-center">
                <div className="h-64 w-48 rounded-lg bg-midnight-800 border border-midnight-700 flex items-center justify-center text-midnight-500">
                  <Image className="w-8 h-8 mr-2" />
                  <span className="text-sm">海报加载失败</span>
                </div>
              </div>
            )}

            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  片名 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="例如：银翼杀手2049"
                  className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  海报链接 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="url"
                  value={form.posterUrl}
                  onChange={(e) => {
                    updateField("posterUrl", e.target.value);
                    setPreviewError(false);
                  }}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  导演
                </label>
                <input
                  type="text"
                  value={form.director}
                  onChange={(e) => updateField("director", e.target.value)}
                  placeholder="例如：丹尼斯·维伦纽瓦"
                  className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  主演（用 / 分隔）
                </label>
                <input
                  type="text"
                  value={form.cast}
                  onChange={(e) => updateField("cast", e.target.value)}
                  placeholder="例如：瑞恩·高斯林 / 哈里森·福特"
                  className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  年份
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  placeholder="2024"
                  className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-200 mb-2">
                  时长（分钟）
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.runtime}
                  onChange={(e) => updateField("runtime", e.target.value)}
                  placeholder="120"
                  className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all"
                />
              </div>
            </div>

            {/* 类型选择 */}
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                类型 <span className="text-amber-500">*</span>（可多选）
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      form.genres.includes(genre)
                        ? "bg-amber-500 text-midnight-900 shadow-lg shadow-amber-500/20"
                        : "bg-midnight-800 text-midnight-300 hover:bg-midnight-700 border border-midnight-700 hover:border-amber-500/30"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* 评分 */}
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                评分（1-10分）：
                <span className="text-amber-400 ml-2 font-semibold text-lg">
                  {form.rating.toFixed(1)}
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={form.rating}
                  onChange={(e) =>
                    updateField("rating", parseFloat(e.target.value))
                  }
                  className="flex-1 accent-amber-500"
                />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = form.rating >= (i + 1) * 2;
                    const half =
                      !filled && form.rating >= (i + 1) * 2 - 1;
                    return (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          filled || half
                            ? "text-amber-500 fill-amber-500"
                            : "text-midnight-600"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 短评 */}
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                一句话短评 <span className="text-amber-500">*</span>
              </label>
              <textarea
                value={form.shortReview}
                onChange={(e) => updateField("shortReview", e.target.value)}
                placeholder="用一句话概括你的观影感受..."
                rows={2}
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all resize-none font-serif italic"
              />
              <p className="text-right text-xs text-midnight-500 mt-1">
                {form.shortReview.length}/100
              </p>
            </div>

            {/* 完整评论 */}
            <div>
              <label className="block text-sm font-medium text-midnight-200 mb-2">
                完整影评 <span className="text-amber-500">*</span>
              </label>
              <textarea
                value={form.fullReview}
                onChange={(e) => updateField("fullReview", e.target.value)}
                placeholder="尽情抒发你的观影感想吧，越详细越好..."
                rows={10}
                className="w-full px-4 py-3 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-amber-500/50 input-glow transition-all resize-none font-serif leading-relaxed"
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg bg-midnight-800 text-midnight-200 hover:bg-midnight-700 border border-midnight-700 font-medium transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-amber-500 text-midnight-900 hover:bg-amber-400 font-semibold transition-all hover:shadow-lg hover:shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                保存影评
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
