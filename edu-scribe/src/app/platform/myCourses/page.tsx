"use client";
import React, { useEffect, useState } from "react";
import { Course, columns } from "./columns";
import { columnsTeacher } from "./columns-teacher";
import { DataTable } from "./data-table";
import { BookCopy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useCurrentUserContext } from "../../currentUserProvider";

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const currentUser = useCurrentUserContext();
  const fetchMyCoursesTeacher = async () => {
    try {
      const response = await fetch("/api/courses/myCoursesTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch students.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  useEffect(() => {
    if (currentUser?.role === "TEACHER") {
      fetchMyCoursesTeacher().then((data) => {
        setCourses(data);
      });
    }
  }, []);

  if (currentUser.role !== "TEACHER" && currentUser.role !== "USER") {
    window.location.href = "/platform";
    return null;
  }
  return (
    <div className="py-10 px-10 grid grid-cols-12 gap-10">
      <div className="col-span-6">
        <div className="flex gap-3 mb-5">
          <BookCopy size={25} />
          <h1 className="text-xl font-semibold">My courses</h1>
        </div>
        {currentUser.role === "TEACHER" ? (
          <DataTable columns={columnsTeacher} data={courses} />
        ) : (
          <DataTable columns={columns} data={courses} />
        )}
      </div>
      <div className="flex justify-center">
        <Separator orientation="vertical" className="h-[760px] col-span-1" />
      </div>
      <div className="col-span-5">
        <div className="flex flex-col items-end">CHART 1</div>
      </div>

      <div className="absolute right-0 bottom-0">
        <Image
          src="/kid-yellow-img.svg"
          width={440}
          height={415}
          alt="Picture of the author"
        />
      </div>
    </div>
  );
}
