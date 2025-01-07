"use client";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export interface Invitation {
  course: string;
  courseId: number;
  date: string;
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    firstLogin: boolean;
    profilePictureVersion: number;
    registrationDate: string;
  };
}

export default function CourseInvitations() {
  const [requests, setRequests] = useState<Invitation[]>([]);
  const getInvitationsTeacher = async () => {
    try {
      const response = await fetch("/api/invitations/myInvitationsTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch invitations requests.");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Invitations requests fetch failed:", error);
    }
  };

  useEffect(() => {
    getInvitationsTeacher();
  }, []);

  return (
    <div className="py-10 px-10 grid grid-cols-12 gap-10">
      <div className="col-span-6">
        <div className="flex gap-3 mb-5">
          <UserCheck size={25} />
          <h1 className="text-xl font-semibold">Courses invitations</h1>
        </div>
        <DataTable columns={columns} data={requests} />
      </div>
      <div className="flex justify-center">
        <Separator orientation="vertical" className="h-[760px] col-span-1" />
      </div>
      <div className="col-span-5">
        <div className="flex flex-col items-end">CHART 1</div>
      </div>

      <div className="absolute right-0 bottom-0">
        <Image
          src="/yellow-kid-learning-img.svg"
          width={440}
          height={415}
          alt="Picture of the author"
        />
      </div>
    </div>
  );
}
