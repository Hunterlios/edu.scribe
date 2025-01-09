"use client";
import React, { useEffect, useState } from "react";
import { Student, columns } from "./columns";
import { DataTable } from "./data-table";
import { GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useCurrentUserContext } from "@/app/currentUserProvider";

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const currentUser = useCurrentUserContext();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/users/getStudents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch students.");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      fetchData();
    }
  }, []);

  if (currentUser?.role !== "ADMIN") {
    window.location.href = "/platform";
    return;
  }

  return (
    <div className="py-10 px-10 grid grid-cols-12 gap-10">
      <div className="col-span-8">
        <div className="flex gap-3 mb-3">
          <GraduationCap size={25} />
          <h1 className="text-xl font-semibold">Students list</h1>
        </div>
        <DataTable columns={columns} data={students} />
      </div>
      <div className="flex justify-center">
        <Separator orientation="vertical" className="h-[760px] col-span-1" />
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
