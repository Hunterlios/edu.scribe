"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const declineRequest = async (id: number) => {
  try {
    const response = await fetch("/api/auth/decline", {
      method: "POST",
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

const acceptRequest = async (userRole: string, id: number) => {
  if (userRole === "1") {
    try {
      const response = await fetch("/api/auth/registerNewStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        console.error("Couldn't register student.");
      }
      window.location.reload();
    } catch (error) {
      console.error("Decline failed:", error);
    }
  } else if (userRole === "2") {
    try {
      const response = await fetch("/api/auth/registerNewTeacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        console.error("Couldn't register teacher.");
      }
      window.location.reload();
    } catch (error) {
      console.error("Decline failed:", error);
    }
  }
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
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
    header: "User Role",
    accessorKey: "role",
    cell: ({ row }) => {
      const [role, setRole] = useState(row.original.role);

      const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        row.original.role = newRole;
      };
      return (
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px] bg-transparent">
            <SelectValue placeholder="User Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Student</SelectItem>
            <SelectItem value="2">Teacher</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleAcceptClick = () => {
        const selectedRole = row.original.role;
        const id = row.original.id;
        acceptRequest(selectedRole, id);
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
