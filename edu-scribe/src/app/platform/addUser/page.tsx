"use client";
import React, { useEffect, useState } from "react";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";
import { UserCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useCurrentUserContext } from "@/app/currentUserProvider";

export default function AddUser() {
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useCurrentUserContext();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/auth/requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch users.");
      }
      let data = await response.json();
      data = data.map((user: User) => {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: "",
        };
      });
      setUsers(data);
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
          <UserCheck size={25} />
          <h1 className="text-xl font-semibold">New users</h1>
        </div>
        <DataTable columns={columns} data={users} />
      </div>
      <div className="flex justify-center">
        <Separator orientation="vertical" className="h-[760px] col-span-1" />
      </div>
      <div className="absolute right-0 bottom-0">
        <Image
          src="/add-user-img.svg"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </div>
    </div>
  );
}
