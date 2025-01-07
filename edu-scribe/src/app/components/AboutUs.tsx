import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutUs() {
  return (
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
  );
}
