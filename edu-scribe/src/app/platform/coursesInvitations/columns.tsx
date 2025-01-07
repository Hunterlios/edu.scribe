"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Invitation } from "./page";

const declineRequest = async (id: number) => {
  try {
    const response = await fetch("/api/invitations/decline", {
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

const acceptRequest = async (id: number) => {
  try {
    const response = await fetch("/api/invitations/acceptUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      console.error("Couldn't add user to course.");
    }
    window.location.reload();
  } catch (error) {
    console.error("Add user to course failed:", error);
  }
};

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row.user.id,
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
    accessorFn: (row) => row.user.firstName,
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
    accessorFn: (row) => row.user.lastName,
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
    accessorFn: (row) => row.user.email,
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleAcceptClick = () => {
        const id = row.original.id;
        acceptRequest(id);
      };
      const handleDeclineClick = () => {
        const id = row.original.id;
        declineRequest(id);
      };
      return (
        <div className="flex gap-4">
          <Button
            size="sm"
            variant="outline"
            className="w-[80px] bg-transparent"
            onClick={handleAcceptClick}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="w-[80px]"
            onClick={handleDeclineClick}
          >
            Reject
          </Button>
        </div>
      );
    },
  },
];
