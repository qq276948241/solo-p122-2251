import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Film, Search, Plus, ArrowUpDown, Star, Clock, ArrowDownAZ } from "lucide-react";
import { useMovieStore, type SortBy } from "@/store/useMovieStore";
import GenreTags from "./GenreTags";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = useMovieStore((state) => state.searchQuery);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const sortBy = useMovieStore((state) => state.sortBy);
  const setSortBy = useMovieStore((state) => state.setSortBy);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions: { value: SortBy; label: string; icon: typeof Star }[] = [
    { value: "rating", label: "评分最高", icon: Star },
    { value: "recent", label: "最近录入", icon: Clock },
    { value: "title", label: "片名 A-Z", icon: ArrowDownAZ },
  ];

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || "排序";

  return (
    <header className="sticky top-0 z-50 bg-midnight-950/90 backdrop-blur-xl border-b border-midnight-800">
      <div className="container py-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Film className="w-7 h-7 text-amber-500 group-hover:text-amber-400 transition-colors" />
              <span className="font-display text-2xl font-bold text-midnight-100 tracking-wide">
                深夜影话
              </span>
            </div>

            {location.pathname === "/" && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-midnight-800/60 border border-midnight-700 text-midnight-300 text-sm hover:bg-midnight-700 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{currentSortLabel}</span>
                </button>

                {showSortMenu && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 rounded-lg bg-midnight-800 border border-midnight-700 shadow-xl shadow-black/30 overflow-hidden z-50 animate-fade-in">
                    {sortOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = sortBy === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                            isActive
                              ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                              : "text-midnight-200 hover:bg-midnight-700/60 border-l-2 border-transparent"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
