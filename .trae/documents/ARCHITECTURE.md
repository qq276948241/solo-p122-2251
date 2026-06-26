# 深夜影话 · 架构说明（新手向）

> 本文档写给第一次接触这个项目的开发者，像聊天一样带你把整个项目的数据流串一遍。

---

## 一、先看目录结构，心里有个谱

```
src/
├── types/index.ts          # 所有类型定义，先读这个！
├── data/mockMovies.ts      # 预置的 8 部电影测试数据
├── store/useMovieStore.ts  # 🔴 核心：状态管理，所有数据都在这
├── hooks/useMovieFilter.ts # 🟡 自定义 hook：搜索+筛选+排序组合逻辑
├── pages/
│   ├── HomePage.tsx        # 首页（瀑布流列表）
│   ├── MovieDetailPage.tsx # 详情页
│   └── AddMoviePage.tsx    # 录入页
├── components/
│   ├── Header.tsx          # 顶部栏（搜索+类型标签+排序+录入按钮）
│   ├── MovieGrid.tsx       # 瀑布流容器
│   ├── MovieCard.tsx       # 单张电影卡片
│   ├── GenreTags.tsx       # 9 个类型筛选标签
│   └── StarRating.tsx      # 星级评分小组件
└── App.tsx                 # 路由配置
```

**建议阅读顺序**：`types` → `store` → `hooks` → `App` → `pages` → `components`

---

## 二、🔴 核心：Zustand Store 怎么组织的

所有电影数据、搜索关键词、筛选条件、排序方式**全部存在这一个 store 里**，没有后端，纯前端。

### 2.1 数据存在哪些字段里？

看 [useMovieStore.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/store/useMovieStore.ts#L8-L19)：

```typescript
interface MovieState {
  movies: Movie[];           // 所有电影数组，🔴 真正存数据的地方
  searchQuery: string;       // 搜索框输入的关键词
  selectedGenre: string | null; // 选中的类型标签（null = 全部）
  sortBy: SortBy;            // 排序方式："rating" | "recent" | "title"
  // ... 下面是方法
}
```

**重要**：`movies` 数组是唯一的数据源，其他都是"过滤条件"。真正的数据只存一份，过滤都是基于它派生的。

### 2.2 增删改查走哪些方法？

同样在 [useMovieStore.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/store/useMovieStore.ts#L29-L52)：

| 方法 | 作用 | 调用方 |
|---|---|---|
| `addMovie(movieData)` | 新增电影，自动加 `id` 和 `createdAt` | 录入页 `AddMoviePage` |
| `deleteMovie(id)` | 根据 id 删除电影 | 详情页 `MovieDetailPage` |
| `getMovieById(id)` | 根据 id 捞单部电影 | 详情页 `MovieDetailPage` |
| `setSearchQuery(query)` | 更新搜索关键词 | 顶部栏 `Header` 的搜索框 |
| `setSelectedGenre(genre)` | 更新选中的类型标签 | 类型标签 `GenreTags` |
| `setSortBy(sort)` | 更新排序方式 | 顶部栏 `Header` 的排序下拉 |

### 2.3 本地持久化是怎么做的？

Zustand 的 `persist` 中间件自动搞定了，看 [useMovieStore.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/store/useMovieStore.ts#L54-L67)：

```typescript
persist(
  (set, get) => ({ /* state + methods */ }),
  {
    name: "movie-review-storage", // localStorage 的 key
    merge: (persisted, current) => ({ /* 合并策略 */ }),
    partialize: (state) => ({      // 只持久化这 4 个字段
      movies: state.movies,
      searchQuery: state.searchQuery,
      selectedGenre: state.selectedGenre,
      sortBy: state.sortBy,
    }),
  }
)
```

**意味着**：你在搜索框输入、点类型标签、选排序方式、新增/删除电影——**所有操作都会自动同步到 localStorage**，刷新页面也不丢。

### 2.4 两个重要的纯函数

Store 还导出了两个不依赖 state 的纯函数，专门用来做数据处理（方便测试和复用）：

- [filterMovies()](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/store/useMovieStore.ts#L71-L85)：根据搜索关键词 + 类型标签过滤电影
- [sortMovies()](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/store/useMovieStore.ts#L87-L106)：根据排序方式对电影排序

它们都不会修改原数组，返回新数组。

---

## 三、🟡 数据是怎么从 Store 流到首页的？

这是整个项目最巧妙的地方——**`useMovieFilter` 自定义 hook**。

### 3.1 HomePage 里发生了什么？

看 [HomePage.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/pages/HomePage.tsx)，整个组件只有 40 行不到，核心逻辑就一行：

```typescript
const { totalCount, filteredCount, displayMovies } = useMovieFilter();
```

然后把 `displayMovies` 丢给 `MovieGrid` 就完事了：

```tsx
<MovieGrid movies={displayMovies} />
```

**HomePage 自己不做任何数据处理**，它只负责 UI 布局。

### 3.2 useMovieFilter 到底干了啥？

看 [useMovieFilter.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/hooks/useMovieFilter.ts)，整个流程分三步：

1. **从 Store 拿原始值**：`movies` / `searchQuery` / `selectedGenre` / `sortBy`
2. **第一次 useMemo**：用 `filterMovies()` 做搜索 + 类型筛选，得到 `filteredMovies`
3. **第二次 useMemo**：用 `sortMovies()` 对 `filteredMovies` 排序，得到最终的 `displayMovies`

```
原始 movies (8部)
    ↓ filterMovies(searchQuery, selectedGenre)
filteredMovies (比如科幻类型有2部)
    ↓ sortMovies(sortBy)
displayMovies (按评分降序排好的2部)
```

**为什么用两次 useMemo？** 性能优化——搜索或类型变了只重新过滤，排序变了只重新排序，互不干扰。

---

## 四、组件层级：列表是怎么渲染出来的？

### 4.1 组件调用链

```
HomePage
    ↓ 传 displayMovies
MovieGrid
    ↓ map 遍历，传单个 movie
MovieCard × N
```

### 4.2 MovieGrid 做了什么？

看 [MovieGrid.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/components/MovieGrid.tsx)：

- 接收 **唯一 prop**：`movies: Movie[]`
- 空数组时显示 🎬 "没有找到符合条件的电影" 空状态
- 非空时用 CSS 瀑布流 `.masonry-grid` 渲染卡片
- 每张卡片有 50ms 的递进动画延迟（`animationDelay: ${index * 50}ms`）

**MovieGrid 是纯展示组件**，它不关心数据怎么来的，只负责把拿到的数组渲染出来。

### 4.3 MovieCard 接收哪些 props？

看 [MovieCard.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/components/MovieCard.tsx#L5-L7)：

```typescript
interface MovieCardProps {
  movie: Movie; // 一整部电影对象
}
```

它拿到完整的 `Movie` 对象后：
- 显示海报、片名、年份、类型标签
- 右上角显示星级评分 `StarRating`
- 底部显示斜体的一句话短评
- **点击整张卡片** → `navigate(`/movie/${movie.id}`)` 跳详情页

---

## 五、路由和详情页：点击卡片后发生了什么？

### 5.1 路由配置

看 [App.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo122/project122/src/App.tsx#L9-L12)，三条路由：

```typescript
<Route path="/" element={<HomePage />} />
<Route path="/movie/:id" element={<MovieDetailPage />} />  {/* 注意这个 :id */}
<Route path="/add" element={<AddMoviePage />} />
```

### 5.2 从卡片点击到详情页的完整链路

1. **用户点卡片**：`MovieCard` 里 `onClick={() => navigate(`/movie/${movie.id}`)}`，URL 变成 `/movie/123`
2. **路由匹配**：React Router 匹配到 `/movie/:id`，把 `id=123` 传给 `MovieDetailPage`
3. **详情页取 id**：用 `useParams()` 拿到路由参数
4. **详情页捞数据**：调用 store 的 `getMovieById(id)` 从 `movies` 数组里找到那部电影

看 [MovieDetailPage.tsx] 里的核心代码：

```typescript
const { id } = useParams();
const getMovieById = useMovieStore((s) => s.getMovieById);
const movie = getMovieById(id!);

if (!movie) {
  return <div>电影不存在</div>;
}
```

就是这么简单！因为所有数据都在 store 里，不需要发请求，直接根据 id 捞就行。

---

## 六、完整数据流一览

把整个项目串起来看：

### 新增电影的流向
```
AddMoviePage 填表单
    ↓ 调用 store.addMovie()
store 把新电影 unshift 到 movies 数组开头
    ↓ persist 自动写 localStorage
    ↓ navigate("/") 回到首页
HomePage 重新渲染
    ↓ useMovieFilter 重新计算（新电影已在 movies 里）
displayMovies 包含新电影
    ↓ 传给 MovieGrid
页面显示最新录入的电影 ✓
```

### 筛选电影的流向
```
用户在 Header 输入搜索词 / 点类型标签 / 选排序
    ↓ 调用 store.setSearchQuery() / setSelectedGenre() / setSortBy()
store 更新对应字段 + persist 写 localStorage
    ↓ useMovieFilter 监听到依赖变化，重新计算
displayMovies 更新
    ↓ MovieGrid 重新渲染
列表实时刷新 ✓
```

### 看详情的流向
```
用户点 MovieCard
    ↓ navigate(`/movie/${id}`)
URL 变了，React Router 挂载 MovieDetailPage
    ↓ useParams() 拿到 id
    ↓ store.getMovieById(id) 捞数据
MovieDetailPage 渲染完整影评 ✓
```

---

## 七、新手踩坑提醒

1. **Zustand selector 陷阱**：只能 selector 取状态值（`s => s.movies`），**不要**在 selector 里调用函数返回新数组（比如 `s => s.getFilteredMovies()`），会导致无限重渲染。派生计算放 `useMemo` 里。

2. **sortBy 持久化**：store 里 `merge` 函数专门处理了 `sortBy` 字段，确保新旧版本数据迁移时不丢。

3. **空数组防御**：`filterMovies` / `sortMovies` / `useMovieFilter` 里都有 `Array.isArray()` 判断，任何异常情况都返回空数组，不会传 `undefined` 给下游导致空白。

4. **CSS 瀑布流**：别改 `.masonry-grid` 的 `column-count`，响应式断点已经写好了（4→3→2→1 列）。

---

就这些了！跟着这条线读代码，很快就能上手。
