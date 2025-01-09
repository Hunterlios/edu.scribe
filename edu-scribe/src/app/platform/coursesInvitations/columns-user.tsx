"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Invitation } from "./page";

export const columnsUser: ColumnDef<Invitation>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.courseId,
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
    accessorKey: "course",
    accessorFn: (row) => row.course,
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
    accessorFn: (row) => format(new Date(row.date), "dd.MM.yyyy HH:mm"),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Request date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    accessorFn: (row) => "Pending",
    header: "Status",
  },
];
