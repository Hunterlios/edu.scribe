"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUserContext } from "@/app/currentUserProvider";
import { Quiz } from "../page";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const currentUser = useCurrentUserContext();
  const quizId = searchParams.get("quiz");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  console.log(quizId);
  return (
    <div>
      {quizId} {currentUser.role}
    </div>
  );
}
