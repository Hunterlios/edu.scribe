"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AllFromTask = {
  id?: number;
  deadline: string;
  firstName: string;
  lastName: string;
  state: string;
  downloadURL?: string;
  fileName?: string;
  date?: string;
};

const handleDownload = async (downloadLink: string, fileName: string) => {
  try {
    const response = await fetch("/api/resources/download", {
      method: "POST",
      body: JSON.stringify({ downloadLink, fileName }),
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return response;
  } catch (error) {
    console.error("Decline failed:", error);
  }
};

export const columns: ColumnDef<AllFromTask>[] = [
  {
    accessorKey: "firstName",
    accessorFn: (row) => row.firstName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    accessorFn: (row) => row.lastName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Surname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Upload date",
    accessorKey: "date",
  },
  {
    header: "Deadline",
    accessorKey: "deadline",
  },
  {
    accessorKey: "status",
    accessorFn: (row) =>
      (row.state === "0" && "❌") || (row.state === "1" && "☑️") || "✅",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-background-light/70"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "downloadURL",
    header: "Download",
    cell: ({ cell, row }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            row.original.downloadURL &&
            row.original.fileName &&
            handleDownload(row.original.downloadURL, row.original.fileName)
          }
          className="hover:bg-transparent hover:text-background-light/70"
        >
          {row.original.fileName}
        </Button>
      );
    },
  },
];
