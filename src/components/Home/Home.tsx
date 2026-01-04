import { ScrollCard } from "../Cards/ScrollCard";
import { examplePosts } from "@/mock/mockpublic";

const Home = () => {
  const navs = [
    { name: "Siguiendo", path: "/siguiendo" },
    { name: "Inicio", path: "/inicio" },
    { name: "Eventos", path: "/eventos" },
  ];

  return <ScrollCard posts={examplePosts} navs={navs} />;
};

export default Home;
