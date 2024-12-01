import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Hero() {
  return (
    <div id="hero" className="h-full w-full">
      <div className="flex flex-row justify-between items-center fixed w-full h-[80px] bg-background-light drop-shadow-sm z-50 px-10">
        <nav className="flex flex-row justify-start gap-14">
          <Link href="#hero">
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
        <Button size={"lg"} className="text-background-light w-auto px-0">
          <Link
            className="text-background-light flex items-center justify-center gap-2 px-8 h-full"
            href="/login"
          >
            <ChevronRight /> Login
          </Link>
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
  );
}
