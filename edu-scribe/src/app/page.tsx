import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "./components/Logo";
import HomePageCard from "./components/Home-page-card";

export default function Home() {
  return (
    <div className="h-screen w-auto">
      {/* Hero */}
      <div id="hero" className="h-full w-full">
        <div className="flex flex-row justify-between items-center fixed w-full h-[80px] bg-background-light drop-shadow-sm z-50 px-10">
          <nav className="flex flex-row justify-start gap-14">
            <Link
              href="#hero"
              className="text-4xl font-extrabold flex flex-row"
            >
              <Logo />
            </Link>
            <ul className="flex flex-row justify-around items-center gap-10 font-semibold text-xl mt-2">
              <li>
                <Link
                  href="#about"
                  className="relative cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-dark before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-dark after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="#platform"
                  className="relative cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-dark before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-dark after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
                >
                  Platform
                </Link>
              </li>
              <li>
                <Link
                  href="#courses"
                  className="relative cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-dark before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-dark after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
                >
                  Course Packs
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="relative cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-dark before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-dark after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
          <Button size={"lg"}>
            <ChevronRight /> Login
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center h-full pt-14 bg-background-light">
          <div className="flex flex-col justify-center items-centerw-full">
            <Image
              src="/hero-background.svg"
              width={1600}
              height={600}
              alt="Picture of the author"
            />
            <div className="absolute top-0 left-0 w-full h-full"></div>
          </div>

          <div className="absolute bottom-12 left-16 mb-8">
            <h1 className="flex flex-col font-extrabold text-8xl text-dark leading-tight">
              <span>
                <span className="text-logo-blue">e</span>xplore.
              </span>
              <span>
                <span className="text-logo-red">d</span>iscover.
              </span>
              <span>
                <span className="text-logo-green">u</span>nderstand.
              </span>
            </h1>
          </div>
        </div>
      </div>
      {/* About us */}
      <div id="about" className="h-full w-full scroll-m-24">
        <div className="h-full w-full flex flex-col justify-start items-center mt-[200px] gap-10">
          <h1 className="font-extrabold text-6xl">About us</h1>
          <p className="font-semibold w-[730px] text-center text-3xl">
            At
            <span className="font-extrabold">
              {" "}
              <span className="text-logo-blue">e</span>
              <span className="text-logo-red">d</span>
              <span className="text-logo-green">u</span>
              <span className="text-dark">.scribe</span>
            </span>
            , we specialize in providing top-tier courses. Our goal is to make
            language learning enjoyable and effective, helping you achieve
            fluency with ease.
          </p>
          <Button size={"lg"} className="text-xl font-medium px-14 py-8">
            Try out
          </Button>
          <Image
            src="/about-us-image.svg"
            width={600}
            height={600}
            alt="Picture of the author"
          />
        </div>
      </div>
      {/* Platform */}
      <div id="platform" className="h-full w-full scroll-m-24">
        <div className="h-full w-full flex flex-col justify-start items-center mt-[200px] gap-10">
          <h1 className="font-extrabold text-6xl">Platform</h1>
          <p className="font-semibold w-[730px] text-center text-3xl">
            Discover expertly crafted language courses designed to suit every
            learning style and level.
          </p>
          <Button size={"lg"} className="text-xl font-medium px-14 py-8">
            Try out
          </Button>
          <div className="flex flex-row gap-8">
            <HomePageCard imgNumber={1} />
            <HomePageCard imgNumber={2} />
            <HomePageCard imgNumber={3} />
          </div>
        </div>
      </div>
      {/* Courses */}
      <div id="courses" className="h-full w-full scroll-m-24">
        <div className="h-full w-full flex flex-col justify-start items-center mt-[200px] gap-10">
          <h1 className="font-extrabold text-6xl">Course Packs</h1>
          <p className="font-semibold w-[730px] text-center text-3xl">
            Enroll in our English, Spanish, or Italian courses and benefit from
            personalized instruction and flexible learning options. Start your
            journey to fluency with lessons tailored to your needs.
          </p>
          <div className="flex flex-row gap-52 mt-24">
            <Image
              src="/united-kingdom-flag.svg"
              width={200}
              height={200}
              alt="Picture of the author"
            />
            <Image
              src="/spain-flag.svg"
              width={200}
              height={200}
              alt="Picture of the author"
            />
            <Image
              src="/italy-flag.svg"
              width={200}
              height={200}
              alt="Picture of the author"
            />
          </div>
          <div className="flex flex-row w-full justify-center items-center gap-52">
            <Image
              src="/kid-yellow-img.svg"
              width={450}
              height={430}
              alt="Picture of the author"
            />
            <h2 className="font-semibold text-center text-2xl text-dark/55 mb-40">
              Choose your language to learn
            </h2>
            <Image
              src="/kid-teacher-red-img.svg"
              width={480}
              height={430}
              alt="Picture of the author"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
