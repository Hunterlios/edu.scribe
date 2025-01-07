"use client";
import React, { useEffect, useState } from "react";
import { Course, columns } from "./columns";
import { columnsAdmin } from "./columns-admin";
import { DataTable } from "./data-table";
import { BookCopy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useCurrentUserContext } from "../../currentUserProvider";

export default function StudentsList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const currentUser = useCurrentUserContext();
  const fetchData = async () => {
    try {
      const response = await fetch("/api/courses/allCourses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch courses.");
      }
      const data = await response.json();
      setCourses(data);
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        const newData = data.map((course: Course) => {
          return {
            ...course,
            role: currentUser?.role,
          };
        });
        setCourses(newData);
      }
    });
  }, []);

  return (
    <div className="py-10 px-10 grid grid-cols-12 gap-10">
      <div className="col-span-6">
        <div className="flex gap-3 mb-5">
          <BookCopy size={25} />
          <h1 className="text-xl font-semibold">Courses list</h1>
        </div>
        {currentUser?.role === "ADMIN" ? (
          <DataTable columns={columnsAdmin} data={courses} />
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
          src="/courses-list-img.svg"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </div>
    </div>
  );
}
