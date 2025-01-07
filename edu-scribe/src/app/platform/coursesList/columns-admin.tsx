"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Course {
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
  zoomLink: string;
  zoomPasscode: string;
  role: string;
}

const removeCourse = async (id: number) => {
  try {
    const response = await fetch("/api/courses/removeCourse", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      window.location.reload();
    }
    window.location.reload();
  } catch (error) {
    console.error("Decline failed:", error);
  }
};

export const columnsAdmin: ColumnDef<Course>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.id,
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
    accessorKey: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Course name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    accessorFn: (row) => row.date,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "author",
    accessorFn: (row) => `${row.author.firstName} ${row.author.lastName}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleRemoveCourse = () => {
        const id = row.original.id;
        removeCourse(id);
      };
      return (
        <div className="flex items-center justify-center">
          <Button
            size="sm"
            variant="destructive"
            className="w-[80px]"
            onClick={handleRemoveCourse}
          >
            Remove
          </Button>
        </div>
      );
    },
  },
];
