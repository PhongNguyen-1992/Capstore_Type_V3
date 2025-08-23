import { useEffect, useState } from "react";
import { Spin, Flex } from "antd";
import Headder from "../Componnent/Headder";
import { Example } from "../Componnent/Carousel";
import MovieList from "./Movie/listmovie";
import Footer from "../Componnent/Footer";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API / load dữ liệu
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // sau 2s tắt loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ height: "100vh", background: "black" }}
      >
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="space-y-6">
        <Headder />
        <Example />
        <MovieList />
        <Footer/>
      </div>
    </div>
  );
}
