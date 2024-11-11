import React from "react";
import Image from "next/image";

export default function HomePageCard({ imgNumber }: { imgNumber: number }) {
  return (
    <div className="w-[400px] h-[490px]">
      <div>
        <Image
          src={`/card-img-${imgNumber}.svg`}
          width={400}
          height={300}
          alt="Picture of the author"
        />
      </div>
      {imgNumber === 1 && (
        <div className="border-2 border-t-0 rounded-t-none rounded-b-md border-[#1FBDE1] h-[190px]">
          <h2 className="font-semibold text-2xl p-5">
            Learn Anytime, Anywhere
          </h2>
          <p className="font-normal text-base px-5">
            Access your courses on any device and learn from wherever you are.
          </p>
        </div>
      )}
      {imgNumber === 2 && (
        <div className="border-2 border-t-0 rounded-t-none rounded-b-md border-[#FF725E] h-[190px]">
          <h2 className="font-semibold text-2xl px-4 py-5">
            Courses from Expert Educators
          </h2>
          <p className="font-normal text-base px-5">
            Access high-quality courses designed by our renowned language school
            on this platform.
          </p>
        </div>
      )}
      {imgNumber === 3 && (
        <div className="border-2 border-t-0 rounded-t-none rounded-b-md border-[#BA68C8] h-[190px]">
          <h2 className="font-semibold text-2xl px-4 py-5">
            Effortless Course Management
          </h2>
          <p className="font-normal text-base px-5">
            Navigate and access courses with just a few clicks - simple and
            intuitive.
          </p>
        </div>
      )}
    </div>
  );
}
