"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  firstLogin: boolean;
  profilePictureVersion: number;
  email: string;
  role: string;
}

const CurrentUserContext = createContext<CurrentUser | undefined>(undefined);

export function useCurrentUserContext() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentUserContext must be used within a CurrentUserProvider"
    );
  }
  return context;
}

export default function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(13);

  const getCurrentUser = async () => {
    try {
      const response = await fetch("/api/users/getCurrentUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else {
        console.error("Couldn't fetch user.");
      }
    } catch (error) {
      console.error("Couldn't fetch user.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Progress value={progress} className="w-[60%]" />
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}
