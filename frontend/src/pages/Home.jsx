import Hero from "../components/user/Hero";
import Stats from "../components/user/Stats";
import CategoryMarquee from "../components/user/CategoryMarque";
import CategoryTabs from "../components/user/CategoryTabs";
import FAQs from "../components/user/FAQs";

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryMarquee />
      <Stats />
      <CategoryTabs />
      <FAQs />
    </div>
  );
};

export default Home;
