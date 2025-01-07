"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PasswordInput(field: any) {
  const [isView, setIsView] = useState(false);
  return (
    <div className="flex flex-row items-center relative">
      <Input {...field} type={isView ? "text" : "password"} maxLength={20} />
      {isView ? (
        <Eye
          size={25}
          className="absolute right-2"
          onClick={() => setIsView(!isView)}
        />
      ) : (
        <EyeOff
          size={25}
          className="absolute right-2"
          onClick={() => setIsView(!isView)}
        />
      )}
    </div>
  );
}
