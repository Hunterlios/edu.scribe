"use client";
import React, { useState, useEffect, act } from "react";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { X, AlertCircle } from "lucide-react";
import { useCurrentUserContext } from "@/app/currentUserProvider";
import { Quiz } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface Exercise {
  id: number;
  quiz: {
    id: number;
    name: string;
    courseName: string;
  };
  content: string;
  type: "SINGLECHOICE" | "MULTICHOICE" | "DROPDOWN" | "OPEN";
  answers: {
    [key: string]: string;
  };
}

const maxAnswers = {
  SINGLECHOICE: 4,
  MULTICHOICE: 8,
  DROPDOWN: 8,
  OPEN: 4,
};

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

  // Exercise creator state
  const [creatorExerciseType, setCreatorExerciseType] =
    useState<keyof typeof maxAnswers>("SINGLECHOICE");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([""]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  });
  const [success, setSuccess] = useState(false);
  const [isManyExercise, setIsManyExercise] = useState(false);
  const [createManyExercise, setCreateManyExercise] = useState<
    {
      quizId: number | null;
      content: string;
      type: string;
      answers: { [key: string]: string };
    }[]
  >([]);

  // Exercise editing state
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isNextHidden, setIsNextHidden] = useState(false);
  const [isPreviousHidden, setIsPreviousHidden] = useState(false);

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
    if (currentUser?.role !== "ADMIN") {
      fetchQuiz().then((data) => {
        setQuiz(data);
      });
      fetchExercises().then((data) => {
        setExercises(data);
        if (data.length > 0 && currentUser?.role === "TEACHER") {
          setEditingExercise(data[activeExercise]);
          setCreatorExerciseType(data[activeExercise].type);
          setQuestion(data[activeExercise].content);
          setAnswers(Object.keys(data[activeExercise].answers));
          setCorrectAnswers(
            Object.keys(data[activeExercise].answers).filter(
              (key) => data[activeExercise].answers[key] === "correct"
            )
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    const maxLimit = maxAnswers[creatorExerciseType];
    setAnswers((prevAnswers) => prevAnswers.slice(0, maxLimit));
    setCorrectAnswers((prevCorrectAnswers) => {
      if (
        creatorExerciseType === "SINGLECHOICE" ||
        creatorExerciseType === "DROPDOWN"
      ) {
        return prevCorrectAnswers.slice(0, 1);
      }
      return prevCorrectAnswers.filter((answer) => answers.includes(answer));
    });
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
    setCorrectAnswers([]);
  };

  const handleCorrectToggle = (index: number) => {
    const selectedAnswer = answers[index];
    if (
      creatorExerciseType === "SINGLECHOICE" ||
      creatorExerciseType === "DROPDOWN"
    ) {
      if (correctAnswers.includes(selectedAnswer)) {
        setCorrectAnswers([]);
      } else {
        setCorrectAnswers([selectedAnswer]);
      }
    } else {
      if (correctAnswers.includes(selectedAnswer)) {
        setCorrectAnswers(
          correctAnswers.filter((ans) => ans !== selectedAnswer)
        );
      } else {
        setCorrectAnswers([...correctAnswers, selectedAnswer]);
      }
    }
  };

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);

      setCorrectAnswers(correctAnswers.filter((ans) => ans !== answers[index]));
    }
  };

  const handleCreateExercise = async () => {
    const questionError =
      question.trim().length <= 0 || question.trim().length > 100
        ? "Question must be between 1 and 100 characters."
        : "";

    let answerError = "";
    let hasAtLeastOneAnswer = false;

    for (let i = 0; i < answers.length - 1; i++) {
      const answer = answers[i];
      if (answer.trim().length <= 0 || answer.trim().length > 50) {
        answerError = `Answer #${i + 1} must be between 1 and 50 characters.`;
        break;
      }
      if (answer.trim()) {
        hasAtLeastOneAnswer = true;
      }
    }

    const hasDuplicateAnswers =
      new Set(answers.map((a) => a.trim())).size !== answers.length;

    if (hasDuplicateAnswers && !answerError) {
      answerError = "Answers must be unique.";
    }

    if (!hasAtLeastOneAnswer) {
      answerError = "You must provide at least one answer.";
    }

    setErrors({ question: questionError, answer: answerError });

    if (answerError) {
      setCorrectAnswers([]);
    }

    if (questionError || answerError) {
      return;
    }
    if (!question || answers.length === 0 || answers.every((a) => !a)) {
      setError(true);
      return;
    }

    let answersObject: { [key: string]: string } = {};

    if (creatorExerciseType === "OPEN") {
      answersObject = answers.reduce(
        (acc: { [key: string]: string }, answer) => {
          if (answer.trim()) {
            acc[answer] = correctAnswers.includes(answer)
              ? "correct"
              : "correct";
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
    } else {
      answersObject = answers.reduce(
        (acc: { [key: string]: string }, answer) => {
          if (answer.trim()) {
            acc[answer] = correctAnswers.includes(answer)
              ? "correct"
              : "incorrect";
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
    }

    const exerciseData = {
      quizId: Number(quizId),
      content: question,
      type: creatorExerciseType,
      answers: answersObject,
    };

    if (isManyExercise) {
      createManyExercise.push(exerciseData);
      try {
        const response = await fetch(`/api/exercises/createManyExercises`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ createManyExercise }),
        });
        if (!response.ok) {
          setError(true);
          setSuccess(false);
          return;
        }
        setError(false);
        setSuccess(true);
        setIsManyExercise(false);
        setQuestion("");
        setAnswers([""]);
        setCorrectAnswers([]);
        setErrors({ question: "", answer: "" });
        router.back();
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    } else {
      try {
        const response = await fetch(`/api/exercises/createExercise`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exerciseData }),
        });
        if (!response.ok) {
          setError(true);
          setSuccess(false);
          return;
        }
        setError(false);
        setSuccess(true);
        setIsManyExercise(false);
        setQuestion("");
        setAnswers([""]);
        setCorrectAnswers([]);
        setErrors({ question: "", answer: "" });
        router.back();
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
  };

  const handleCreateManyExercise = async () => {
    const questionError =
      question.trim().length <= 0 || question.trim().length > 100
        ? "Question must be between 1 and 100 characters."
        : "";

    let answerError = "";
    let hasAtLeastOneAnswer = false;

    for (let i = 0; i < answers.length - 1; i++) {
      const answer = answers[i];
      if (answer.trim().length <= 0 || answer.trim().length > 50) {
        answerError = `Answer #${i + 1} must be between 1 and 50 characters.`;
        break;
      }
      if (answer.trim()) {
        hasAtLeastOneAnswer = true;
      }
    }

    const hasDuplicateAnswers =
      new Set(answers.map((a) => a.trim())).size !== answers.length;

    if (hasDuplicateAnswers && !answerError) {
      answerError = "Answers must be unique.";
    }

    if (!hasAtLeastOneAnswer) {
      answerError = "You must provide at least one answer.";
    }

    setErrors({ question: questionError, answer: answerError });

    if (answerError) {
      setCorrectAnswers([]);
    }

    if (questionError || answerError) {
      return;
    }
    if (!question || answers.length === 0 || answers.every((a) => !a)) {
      setError(true);
      return;
    }

    let answersObject: { [key: string]: string } = {};

    if (creatorExerciseType === "OPEN") {
      answersObject = answers.reduce(
        (acc: { [key: string]: string }, answer) => {
          if (answer.trim()) {
            acc[answer] = correctAnswers.includes(answer)
              ? "correct"
              : "correct";
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
    } else {
      answersObject = answers.reduce(
        (acc: { [key: string]: string }, answer) => {
          if (answer.trim()) {
            acc[answer] = correctAnswers.includes(answer)
              ? "correct"
              : "incorrect";
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
    }

    const exerciseData = {
      quizId: Number(quizId),
      content: question,
      type: creatorExerciseType.toLowerCase(),
      answers: answersObject,
    };

    setIsManyExercise(true);
    createManyExercise.push(exerciseData);
    setQuestion("");
    setAnswers([""]);
    setCorrectAnswers([]);
    setErrors({ question: "", answer: "" });
  };

  const handleUpdateExercise = async () => {
    const questionError =
      question.trim().length <= 0 || question.trim().length > 100
        ? "Question must be between 1 and 100 characters."
        : "";

    let answerError = "";
    let hasAtLeastOneAnswer = false;

    for (let i = 0; i < answers.length - 1; i++) {
      const answer = answers[i];
      if (answer.trim().length <= 0 || answer.trim().length > 50) {
        answerError = `Answer #${i + 1} must be between 1 and 50 characters.`;
        break;
      }
      if (answer.trim()) {
        hasAtLeastOneAnswer = true;
      }
    }

    const hasDuplicateAnswers =
      new Set(answers.map((a) => a.trim())).size !== answers.length;

    if (hasDuplicateAnswers && !answerError) {
      answerError = "Answers must be unique.";
    }

    if (!hasAtLeastOneAnswer) {
      answerError = "You must provide at least one answer.";
    }

    setErrors({ question: questionError, answer: answerError });

    if (answerError) {
      setCorrectAnswers([]);
    }

    if (questionError || answerError) {
      return;
    }
    if (!question || answers.length === 0 || answers.every((a) => !a)) {
      setError(true);
      return;
    }

    let answersObject: { [key: string]: string } = {};

    if (creatorExerciseType === "OPEN") {
      answersObject = answers.reduce(
        (acc: { [key: string]: string }, answer) => {
          if (answer.trim()) {
            acc[answer] = correctAnswers.includes(answer)
              ? "correct"
              : "correct";
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
    } else {
      answersObject = answers.reduce(
        (acc: { [key: string]: string }, answer) => {
          if (answer.trim()) {
            acc[answer] = correctAnswers.includes(answer)
              ? "correct"
              : "incorrect";
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
    }

    const exerciseData = {
      content: question,
      type: creatorExerciseType,
      answers: answersObject,
    };

    try {
      const response = await fetch(`/api/exercises/updateExercise`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: exercises ? Number(exercises[activeExercise].id) : activeExercise,
          exerciseData,
        }),
      });
      if (!response.ok) {
        setError(true);
        setTimeout(() => setError(false), 3000);
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      window.location.reload();
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      console.error("Fetch failed:", error);
    }
  };

  const handleRemoveExercise = async () => {
    try {
      const response = await fetch(`/api/exercises/removeExercise`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: exercises ? Number(exercises[activeExercise].id) : activeExercise,
        }),
      });
      if (!response.ok) {
        setError(true);
        setTimeout(() => setError(false), 3000);
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      window.location.reload();
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      console.error("Fetch failed:", error);
    }
  };

  const updateExerciseState = async (newActiveIndex: number) => {
    if (!exercises) return;
    const exerciseid = exercises[newActiveIndex].id;
    try {
      const response = await fetch(`/api/exercises/getByExerciseId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: exerciseid }),
      });

      const exercise = await response.json();
      setActiveExercise(newActiveIndex);
      setEditingExercise(exercise);
      setCreatorExerciseType(exercise.type);
      setQuestion(exercise.content);
      setAnswers(Object.keys(exercise.answers));
      setCorrectAnswers(
        Object.keys(exercise.answers).filter(
          (key) => exercise.answers[key] === "correct"
        )
      );

      setIsPreviousHidden(newActiveIndex === 0);
      setIsNextHidden(newActiveIndex === exercises.length - 1);
    } catch (error) {
      console.error("Error fetching exercise:", error);
    }
  };

  const handleEditNextExercise = () => {
    if (exercises && activeExercise < exercises.length - 1) {
      updateExerciseState(activeExercise + 1);
    }
  };

  const handleEditPreviousExercise = () => {
    if (exercises && activeExercise > 0) {
      updateExerciseState(activeExercise - 1);
    }
  };

  if (exercises?.length === 0 && currentUser?.role === "TEACHER") {
    return (
      <div className="h-1/3 w-auto flex flex-col gap-3 px-10 py-10">
        <h1 className="text-3xl font-semibold">Quiz: {quiz?.name}</h1>
        <Separator className="mt-2 w-1/3" />
        <div className="w-full h-full flex flex-col gap-10">
          <div className="w-1/3">
            {success ? (
              <Alert variant="default" className="mb-2 border-logo-green">
                <AlertCircle className="h-4 w-4" color="#6DA544" />
                <AlertTitle className="text-logo-green">Success</AlertTitle>
                <AlertDescription className="text-logo-green">
                  Exercise added successfully.
                </AlertDescription>
              </Alert>
            ) : null}
            {error ? (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-logo-red">Error</AlertTitle>
                <AlertDescription></AlertDescription>
              </Alert>
            ) : null}
          </div>
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
          <div className="w-1/3 flex flex-col gap-2">
            {errors.question && (
              <p className="text-sm text-red-500 mt-1">{errors.question}</p>
            )}
            <Label htmlFor="exerciseContent">
              Write your exercise question:
            </Label>
            <Input
              type="text"
              id="exerciseContent"
              placeholder="Exercise question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            {creatorExerciseType && (
              <div className="flex flex-col gap-2">
                {errors.answer && (
                  <p className="text-sm text-red-500 mt-1">{errors.answer}</p>
                )}
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
                    <Button
                      onClick={() => handleRemoveAnswer(index)}
                      variant="ghost"
                      className="text-logo-red hover:scale-110 hover:bg-transparent"
                      disabled={answers.length <= 1}
                    >
                      <X size={32} />
                    </Button>
                    {creatorExerciseType === "MULTICHOICE" && (
                      <Checkbox
                        checked={correctAnswers.includes(answer)}
                        onCheckedChange={() => handleCorrectToggle(index)}
                      />
                    )}
                    {(creatorExerciseType === "SINGLECHOICE" ||
                      creatorExerciseType === "DROPDOWN") && (
                      <Checkbox
                        checked={correctAnswers.includes(answer)}
                        onCheckedChange={() => handleCorrectToggle(index)}
                        disabled={
                          !correctAnswers.includes(answer) &&
                          correctAnswers.length > 0
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/3 flex flex-row gap-2 items-center justify-between">
            <Button
              variant="default"
              className="w-[120px] bg-logo-green hover:bg-green-900"
              onClick={handleCreateExercise}
            >
              End quiz
            </Button>
            <Button
              variant="default"
              className="w-[120px]"
              onClick={handleCreateManyExercise}
            >
              Next exercise
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (exercises && exercises.length > 0 && currentUser?.role === "TEACHER") {
    return (
      <div className="h-1/3 w-auto flex flex-col gap-3 px-10 py-10">
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
        <Separator className="mt-2 w-1/3" />
        <div className="w-full h-full flex flex-col gap-10">
          <div className="w-1/3">
            {success ? (
              <Alert variant="default" className="mb-2 border-logo-green">
                <AlertCircle className="h-4 w-4" color="#6DA544" />
                <AlertTitle className="text-logo-green">Success</AlertTitle>
                <AlertDescription className="text-logo-green">
                  Exercise added successfully.
                </AlertDescription>
              </Alert>
            ) : null}
            {error ? (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-logo-red">Error</AlertTitle>
                <AlertDescription></AlertDescription>
              </Alert>
            ) : null}
          </div>
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
          <div className="w-1/3 flex flex-col gap-2">
            {errors.question && (
              <p className="text-sm text-red-500 mt-1">{errors.question}</p>
            )}
            <Label htmlFor="exerciseContent">
              Write your exercise question:
            </Label>
            <Input
              type="text"
              id="exerciseContent"
              placeholder="Exercise question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div>
            {creatorExerciseType && (
              <div className="flex flex-col gap-2">
                {errors.answer && (
                  <p className="text-sm text-red-500 mt-1">{errors.answer}</p>
                )}
                <Label htmlFor="exerciseAnswers">Write your answers:</Label>
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 items-center w-1/4"
                  >
                    <Input
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        handleAnswerChange(e.target.value, index);
                      }}
                      placeholder={`Answer ${index + 1}`}
                    />
                    <Button
                      onClick={() => handleRemoveAnswer(index)}
                      variant="ghost"
                      className="text-logo-red hover:scale-110 hover:bg-transparent"
                      disabled={answers.length <= 1}
                    >
                      <X size={32} />
                    </Button>
                    {creatorExerciseType === "MULTICHOICE" && (
                      <Checkbox
                        checked={correctAnswers.includes(answer)}
                        onCheckedChange={() => handleCorrectToggle(index)}
                      />
                    )}
                    {(creatorExerciseType === "SINGLECHOICE" ||
                      creatorExerciseType === "DROPDOWN") && (
                      <Checkbox
                        checked={correctAnswers.includes(answer)}
                        onCheckedChange={() => handleCorrectToggle(index)}
                        disabled={
                          !correctAnswers.includes(answer) &&
                          correctAnswers.length > 0
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/3 flex flex-col gap-5">
            <div className="flex flex-row gap-2 justify-end">
              <Button
                variant="link"
                className="w-[80px]"
                size={"sm"}
                onClick={handleEditPreviousExercise}
                disabled={activeExercise === 0}
              >
                Previous
              </Button>
              <Button
                variant="link"
                className="w-[80px]"
                size={"sm"}
                onClick={handleEditNextExercise}
                disabled={activeExercise === exercises.length - 1}
              >
                Next
              </Button>
            </div>
            <Separator className="w-full" />
            <div className="flex flex-row gap-2 justify-between">
              <Button
                variant="default"
                className="w-[120px] bg-logo-green hover:bg-green-900"
                onClick={handleUpdateExercise}
              >
                Save exercise
              </Button>
              <Button
                variant="destructive"
                className="w-[140px]"
                onClick={handleRemoveExercise}
              >
                Remove exercise
              </Button>
              <Button
                variant="default"
                className="w-[120px]"
                onClick={() => router.back()}
              >
                Back to course
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <Image
            src="/quiz-edit-img.svg"
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
      </div>
    );
  }

  if (currentUser?.role === "ADMIN") {
    window.location.href = "/platform";
    return;
  }

  return (
    quiz &&
    exercises &&
    currentUser?.role === "USER" && (
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
              <div className="flex flex-col gap-2 items-center">
                <h1 className="text-3xl font-semibold text-nowrap">Results</h1>
                <p className="text-nowrap text-dark/80 font-semibold">
                  {results.correctAnswers > results.wrongAnswers
                    ? "👏 Congrats! Keep up the good work!"
                    : "🔄 Don't give up, try again!"}
                </p>
              </div>

              <Separator
                orientation="horizontal"
                className="w-2/3 mb-10 mt-5"
              />
              <div className="grid grid-cols-5 items-center text-center">
                <h2 className="col-span-1 text-lg font-semibold text-logo-green">
                  Correct Answers: {results.correctAnswers}
                </h2>

                <div className="col-span-1 flex justify-center">
                  <Separator orientation="vertical" className="h-10 " />
                </div>
                <h2 className="col-span-1 text-3xl font-semibold">
                  Score: {results.score}{" "}
                  {results.correctAnswers > results.wrongAnswers ? "🎉" : "😥"}
                </h2>

                <div className="col-span-1 flex justify-center">
                  <Separator orientation="vertical" className="h-10 " />
                </div>
                <h2 className="col-span-1 text-lg font-semibold text-logo-red">
                  Wrong Answers: {results.wrongAnswers}
                </h2>
              </div>

              <Button
                variant={"default"}
                className="w-[120px] mt-20"
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
              <Separator orientation="horizontal" className="w-2/3 mb-2" />
              <div>
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
        <div className="absolute bottom-0 right-0">
          <Image
            src="/quiz-img.svg"
            width={450}
            height={450}
            alt="Picture of the author"
          />
        </div>
      </div>
    )
  );
}
