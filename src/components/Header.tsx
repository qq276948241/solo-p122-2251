import { useNavigate } from "react-router-dom";
import { Film, Search, Plus } from "lucide-react";
import { useMovieStore } from "@/store/useMovieStore";
import GenreTags from "./GenreTags";

export default function Header() {
  const navigate = useNavigate();
  const searchQuery = useMovieStore((state) => state.searchQuery);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);

  return (
    <header className="sticky top-0 z-50 bg-midnight-950/90 backdrop-blur-xl border-b border-midnight-800">
      <div className="container py-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Film className="w-7 h-7 text-amber-500 group-hover:text-amber-400 transition-colors" />
            <span className="font-display text-2xl font-bold text-midnight-100 tracking-wide">
              深夜影话
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500" />
              <input
                type="text"
                placeholder="搜索电影..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-midnight-800 border border-midnight-700 text-midnight-100 placeholder-midnight-500 text-sm focus:outline-none focus:border-amber-500/50 input-glow transition-all"
              />
            </div>

            <button
              onClick={() => navigate("/add")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-500 text-midnight-900 font-medium text-sm hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">录入新片</span>
            </button>
          </div>
        </div>

        <GenreTags />
      </div>
    </header>
  );
}
