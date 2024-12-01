import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Platform from "./components/Platform";
import Courses from "./components/Courses";
import Faq from "./components/Faq";

export default function Home() {
  return (
    <div className="h-screen w-auto">
      {/* Hero */}
      <Hero />
      {/* About us */}
      <AboutUs />
      {/* Platform */}
      <Platform />
      {/* Courses */}
      <Courses />
      {/* Faq */}
      <Faq />
    </div>
  );
}
