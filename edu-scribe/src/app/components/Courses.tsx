import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Courses() {
  return (
    <div id="courses" className="h-full w-full scroll-m-24">
      <div className="h-full w-full flex flex-col justify-start items-center mt-[200px] gap-10">
        <h1 className="font-extrabold text-6xl">Course Packs</h1>
        <p className="font-semibold w-[730px] text-center text-3xl">
          Enroll in our English, Spanish, or Italian courses and benefit from
          personalized instruction and flexible learning options. Start your
          journey to fluency with lessons tailored to your needs.
        </p>
        <div className="flex flex-row gap-52 mt-24">
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src="/united-kingdom-flag.svg"
                width={200}
                height={200}
                alt="Picture of the author"
                className="hover:scale-105 hover:shadow-lg transform ease-in-out duration-500 cursor-pointer rounded-full"
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-2 border-logo-blue">
              <DialogHeader>
                <DialogTitle className="text-center my-10 text-dark text-2xl font-semibold">
                  English Learning Pack
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-10">
                <Image
                  src="/united-kingdom-flag.svg"
                  width={200}
                  height={200}
                  alt="Picture of the author"
                />
                <p className="text-center">
                  Master English with courses designed by our expert teachers.
                  Access a range of lessons, complete interactive exercises,
                  and earn points as you progress. Study at your own pace with
                  materials that help you improve your skills step by step.
                </p>
              </div>
              <DialogFooter className="sm:justify-center my-10">
                <Button
                  type="button"
                  variant="default"
                  className="bg-logo-blue w-[200px] h-[70px] text-lg hover:bg-blue-900"
                >
                  Get access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src="/spain-flag.svg"
                width={200}
                height={200}
                alt="Picture of the author"
                className="hover:scale-105 hover:shadow-lg transform ease-in-out duration-500 cursor-pointer rounded-full"
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-2 border-logo-red">
              <DialogHeader>
                <DialogTitle className="text-center my-10 text-dark text-2xl font-semibold">
                  Spanish Learning Pack
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-10">
                <Image
                  src="/spain-flag.svg"
                  width={200}
                  height={200}
                  alt="Picture of the author"
                />
                <p className="text-center">
                  Master Spanish with courses designed by our expert teachers.
                  Access a range of lessons, complete interactive exercises,
                  and earn points as you progress. Study at your own pace with
                  materials that help you improve your skills step by step.
                </p>
              </div>
              <DialogFooter className="sm:justify-center my-10">
                <Button
                  type="button"
                  variant="default"
                  className="bg-logo-red w-[200px] h-[70px] text-lg hover:bg-red-800"
                >
                  Get access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src="/italy-flag.svg"
                width={200}
                height={200}
                alt="Picture of the author"
                className="hover:scale-105 hover:shadow-lg transform ease-in-out duration-500 cursor-pointer rounded-full"
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-2 border-logo-green">
              <DialogHeader>
                <DialogTitle className="text-center my-10 text-dark text-2xl font-semibold">
                  Italian Learning Pack
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-10">
                <Image
                  src="/italy-flag.svg"
                  width={200}
                  height={200}
                  alt="Picture of the author"
                />
                <p className="text-center">
                  Master Italian with courses designed by our expert teachers.
                  Access a range of lessons, complete interactive exercises,
                  and earn points as you progress. Study at your own pace with
                  materials that help you improve your skills step by step.
                </p>
              </div>
              <DialogFooter className="sm:justify-center my-10">
                <Button
                  type="button"
                  variant="default"
                  className="bg-logo-green w-[200px] h-[70px] text-lg hover:bg-green-800"
                >
                  Get access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
  );
}
