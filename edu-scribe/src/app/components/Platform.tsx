import { Button } from "@/components/ui/button";
import Link from "next/link";
import HomePageCard from "./HomePageCard";

export default function Platform() {
  return (
    <div id="platform" className="h-full w-full scroll-m-24">
      <div className="h-full w-full flex flex-col justify-start items-center mt-[200px] gap-10">
        <h1 className="font-extrabold text-6xl">Platform</h1>
        <p className="font-semibold w-[730px] text-center text-3xl">
          Discover expertly crafted language courses designed to suit every
          learning style and level.
        </p>
        <Button size={"lg"} className="w-[200px] h-[70px]" asChild>
          <Link
            className="text-background-light text-xl font-medium flex items-center justify-center"
            href="/register"
          >
            Try out
          </Link>
        </Button>
        <div className="flex flex-row gap-8">
          <HomePageCard imgNumber={1} />
          <HomePageCard imgNumber={2} />
          <HomePageCard imgNumber={3} />
        </div>
      </div>
    </div>
  );
}
