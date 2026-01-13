import { ScrollCard } from "../Cards/ScrollCard";
import { usePostStore } from "@/mock/usePostStore";

const Home = () => {
  const navs = [
    { name: "Siguiendo", path: "/siguiendo" },
    { name: "Inicio", path: "/inicio" },
    { name: "Eventos", path: "/eventos" },
  ];

  const posts = usePostStore((s) => s.posts);

  return <ScrollCard posts={posts} navs={navs} />;
};

export default Home;
