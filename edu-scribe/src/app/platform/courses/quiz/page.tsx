"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCurrentUserContext } from "@/app/currentUserProvider";
import { Quiz } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { set } from "date-fns";

interface Exercise {
  id: number;
  quiz: {
    id: number;
    name: string;
    courseName: string;
  };
  content: string;
  type: string;
  answers: {
    [key: string]: string;
  };
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const currentUser = useCurrentUserContext();
  const router = useRouter();
  const quizId = searchParams.get("quiz");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [activeExercise, setActiveExercise] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [multichoiceAnswers, setMultichoiceAnswers] = useState<string[]>([]);
  const [dropdownAnswer, setDropdownAnswer] = useState<string>("");
  const [results, setResults] = useState<{
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
  }>({ score: 0, correctAnswers: 0, wrongAnswers: 0 });

  const [creatorExerciseType, setCreatorExerciseType] =
    useState<keyof typeof maxAnswers>("SINGLECHOICE");
  const [answers, setAnswers] = useState([""]);
  const maxAnswers = {
    SINGLECHOICE: 4,
    MULTICHOICE: 8,
    DROPDOWN: 8,
    OPEN: 4,
  };

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizes/getQuizById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: quizId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch(`/api/exercises/getByQuizId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: quizId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchQuiz().then((data) => {
      setQuiz(data);
    });
    fetchExercises().then((data) => {
      setExercises(data);
    });
  }, []);

  useEffect(() => {
    const maxLimit = maxAnswers[creatorExerciseType];
    setAnswers((prevAnswers) => prevAnswers.slice(0, maxLimit));
  }, [creatorExerciseType]);

  const handleOpenQuestionAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const answer = (formData.get("answer") as string)?.trim().toLowerCase();

    if (exercises && activeExercise === exercises.length - 1) {
      setShowResult(true);
    }
    setActiveExercise(activeExercise + 1);

    if (exercises) {
      const currentAnswers = exercises[activeExercise]?.answers;
      const correctAnswers = Object.keys(currentAnswers).filter(
        (key) => currentAnswers[key] === "correct"
      );

      const isCorrect = correctAnswers.some(
        (correctAnswer) => correctAnswer.toLowerCase() === answer
      );

      setResults({
        ...results,
        score: results.score + (isCorrect ? 1 : 0),
        correctAnswers: results.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: results.wrongAnswers + (!isCorrect ? 1 : 0),
      });
    }
  };

  const handleSingleChoiceAnswer = (selectedKey: string) => {
    if (exercises && activeExercise === exercises.length - 1) {
      setShowResult(true);
    }
    setActiveExercise(activeExercise + 1);

    if (exercises) {
      const currentAnswers = exercises[activeExercise]?.answers;
      const isCorrect = currentAnswers?.[selectedKey] === "correct";

      setResults({
        ...results,
        score: results.score + (isCorrect ? 1 : 0),
        correctAnswers: results.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: results.wrongAnswers + (!isCorrect ? 1 : 0),
      });
    }
  };

  const handleMultichoiceQuestionAnswer = () => {
    if (exercises && activeExercise === exercises.length - 1) {
      setShowResult(true);
    }
    setActiveExercise(activeExercise + 1);
    if (exercises) {
      const currentAnswers = exercises[activeExercise]?.answers;
      const correctAnswers = Object.keys(currentAnswers).filter(
        (key) => currentAnswers[key] === "correct"
      );
      const isCorrect =
        correctAnswers.length === multichoiceAnswers.length &&
        correctAnswers.every((answer) => multichoiceAnswers.includes(answer));

      setResults({
        ...results,
        score: results.score + (isCorrect ? 1 : 0),
        correctAnswers: results.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: results.wrongAnswers + (!isCorrect ? 1 : 0),
      });
    }
    setMultichoiceAnswers([]);
  };

  const handleDropdownQuestionAnswer = () => {
    if (exercises && activeExercise === exercises.length - 1) {
      setShowResult(true);
    }
    setActiveExercise(activeExercise + 1);

    if (exercises) {
      const currentAnswers = exercises[activeExercise]?.answers;
      const correctAnswer = Object.keys(currentAnswers).find(
        (key) => currentAnswers[key] === "correct"
      );

      const isCorrect = dropdownAnswer === correctAnswer;

      setResults({
        ...results,
        score: results.score + (isCorrect ? 1 : 0),
        correctAnswers: results.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: results.wrongAnswers + (!isCorrect ? 1 : 0),
      });

      setDropdownAnswer("");
    }
  };

  const handleCheckboxChange = (value: string) => {
    setMultichoiceAnswers((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleAnswerChange = (value: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;

    if (
      value &&
      index === answers.length - 1 &&
      answers.length < maxAnswers[creatorExerciseType]
    ) {
      newAnswers.push("");
    }

    setAnswers(newAnswers);
  };

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    }
  };

  if (exercises?.length === 0 && currentUser?.role === "TEACHER")
    return (
      <div className="h-1/3 w-auto flex flex-col items-center justify-center gap-3 px-10 py-10">
        <h1 className="text-3xl font-semibold text-nowrap">
          Quiz: {quiz?.name}
        </h1>
        <div className="w-full h-full flex flex-col gap-10">
          {/* Exercise Type Selector */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="exerciseType">Select exercise type:</Label>
            <Select
              value={creatorExerciseType}
              onValueChange={(value: string) =>
                setCreatorExerciseType(value as keyof typeof maxAnswers)
              }
            >
              <SelectTrigger className="max-w-full w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="exerciseType">
                <SelectItem value="SINGLECHOICE">Single choice</SelectItem>
                <SelectItem value="MULTICHOICE">Multiple choice</SelectItem>
                <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                <SelectItem value="OPEN">Open question</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Input */}
          <div className="w-1/3 flex flex-col gap-2">
            <Label htmlFor="exerciseContent">
              Write your exercise question:
            </Label>
            <Input
              type="text"
              id="exerciseContent"
              placeholder="Exercise question"
            />
          </div>

          {/* Answers Section */}
          <div>
            {creatorExerciseType && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="exerciseAnswers">Write your answers:</Label>
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 items-center w-1/4"
                  >
                    <Input
                      type="text"
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(e.target.value, index)
                      }
                      placeholder={`Answer ${index + 1}`}
                    />
                    {/* Remove cross button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveAnswer(index)}
                      className="text-red-500 ml-2"
                      disabled={answers.length <= 1} // Disable the cross button if there's only one answer
                    >
                      ❌
                    </button>
                    {/* Checkbox for SINGLECHOICE and MULTICHOICE */}
                    {(creatorExerciseType === "SINGLECHOICE" ||
                      creatorExerciseType === "MULTICHOICE") && (
                      <Checkbox id={`answer-correct-${index}`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    quiz &&
    exercises &&
    currentUser?.role === "STUDENT" && (
      <div className="py-10 px-10 flex flex-col gap-4 h-full w-full items-center">
        <div className="h-1/3 w-auto flex flex-col items-center justify-center gap-3">
          <h1 className="text-3xl font-semibold text-nowrap">
            Quiz: {quiz?.name}
          </h1>
          <h2 className="text-xl font-semibold text-nowrap">
            Exercise:{" "}
            {activeExercise < exercises.length
              ? activeExercise + 1
              : exercises.length}
            /{exercises.length}
          </h2>
        </div>
        <div className="w-full h-full">
          {showResult ? (
            <div className="flex flex-col gap-4 items-center">
              <h1 className="text-3xl font-semibold text-nowrap">Results</h1>
              <h2>Score: {results.score}</h2>
              <h2>Correct Answers: {results.correctAnswers}</h2>
              <h2>Wrong Answers: {results.wrongAnswers}</h2>
              <Button
                variant={"default"}
                className="w-[120px]"
                onClick={() => router.back()}
              >
                Go back
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-10 items-center w-full h-full">
              <h1 className="text-3xl font-semibold text-nowrap">
                {exercises[activeExercise]?.content}
              </h1>
              <div className="">
                {(exercises[activeExercise]?.type === "SINGLECHOICE" && (
                  <div
                    className={
                      Object.keys(exercises[activeExercise]?.answers).length %
                        2 ===
                      0
                        ? "grid grid-cols-2 gap-4"
                        : "grid grid-cols-3 gap-4"
                    }
                  >
                    {Object.entries(exercises[activeExercise]?.answers).map(
                      ([key, value]) => (
                        <Button
                          variant={"default"}
                          className="min-w-[150px] max-w-[350px] text-wrap h-auto"
                          key={key}
                          onClick={() => handleSingleChoiceAnswer(key)}
                        >
                          {key}
                        </Button>
                      )
                    )}
                  </div>
                )) ||
                  (exercises[activeExercise]?.type === "MULTICHOICE" && (
                    <div className="flex flex-col gap-2 justify-center">
                      {Object.entries(exercises[activeExercise]?.answers).map(
                        ([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <Checkbox
                              id={key}
                              checked={multichoiceAnswers.includes(key)}
                              onClick={() => handleCheckboxChange(key)}
                            />
                            <label htmlFor={key}>{key}</label>
                          </div>
                        )
                      )}
                      <Button
                        variant={"default"}
                        className="min-w-[150px] mt-10"
                        onClick={() => handleMultichoiceQuestionAnswer()}
                      >
                        Next
                      </Button>
                    </div>
                  )) ||
                  (exercises[activeExercise]?.type === "OPEN" && (
                    <form
                      onSubmit={handleOpenQuestionAnswer}
                      className="w-[500px] flex flex-row gap-2"
                    >
                      <Input
                        type="text"
                        name="answer"
                        className="w-full"
                        placeholder="Write your answer"
                      />
                      <Button
                        variant={"default"}
                        type="submit"
                        className="w-[150px]"
                      >
                        Next
                      </Button>
                    </form>
                  )) ||
                  (exercises[activeExercise]?.type === "DROPDOWN" && (
                    <div className="flex flex-row gap-2 items-center w-[500px]">
                      <Select
                        value={dropdownAnswer}
                        onValueChange={setDropdownAnswer}
                      >
                        <SelectTrigger className="max-w-full w-[300px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(
                            exercises[activeExercise]?.answers
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={"default"}
                        className="w-[150px]"
                        onClick={() => handleDropdownQuestionAnswer()}
                      >
                        Next
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
