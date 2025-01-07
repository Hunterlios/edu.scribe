"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type Student = {
  userDTO: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    firstLogin: boolean;
    profilePictureVersion: number;
    registrationDate: string;
  };
  courses: [
    {
      id: number;
      name: string;
      date: string;
      author: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        firstLogin: boolean;
        profilePictureVersion: number;
        registrationDate: string;
      };
      zoomPasscode: string;
      zoomLink: string;
    }
  ];
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.userDTO.id,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    accessorFn: (row) => row.userDTO.firstName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    accessorFn: (row) => row.userDTO.lastName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => row.userDTO.email,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "courses",
    accessorFn: (row) => row.courses.map((course) => course.name).join(", "),
    header: "Courses",
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger className="text-background-light underline underline-offset-4 flex justify-center cursor-pointer">
            {row.original.courses.length}
          </HoverCardTrigger>
          <HoverCardContent align="start" alignOffset={30} className="bg-dark">
            {row.original.courses.length <= 0 ? (
              <div>
                <h1 className="text-lg font-semibold text-background-light flex flex-row gap-2 items-center my-2">
                  <ChevronRight size={16} />
                  No courses
                </h1>
              </div>
            ) : (
              <div>
                {row.original.courses.map((course) => (
                  <div key={course.id}>
                    <h1 className="text-lg font-semibold text-background-light flex flex-row gap-2 items-center my-2">
                      <ChevronRight size={16} />
                      {course.name}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];
