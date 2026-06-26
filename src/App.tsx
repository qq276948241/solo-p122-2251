import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import AddMoviePage from "@/pages/AddMoviePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/add" element={<AddMoviePage />} />
      </Routes>
    </Router>
  );
}
