import Headder from "./Componnent/Headder";
import { Example } from "./Componnent/Carousel";
import MovieList from "./Movie/listmovie";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="space-y-16">
        <Headder />
        <Example />
        <MovieList />
      </div>
    </div>
  );
}
