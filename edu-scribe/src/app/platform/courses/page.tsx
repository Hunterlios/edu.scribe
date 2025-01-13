"use client";
import React, { useState, useEffect, ChangeEventHandler } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import LessonCard from "@/app/components/LessonsCard/LessonCard";
import QuizCard from "@/app/components/QuizCard";
import { useCurrentUserContext } from "@/app/currentUserProvider";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { AlertCircle, CalendarIcon, CircleHelp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Course {
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
}

interface CourseResource {
  fileName: string;
  downloadURL: string;
  fileType: string;
  uploadDate: string;
}

export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  firstLogin: boolean;
  profilePictureVersion: number;
  registrationDate: string;
  state: string;
}

export interface Tasks {
  id: number;
  contents: string;
  date: string;
  deadline: string;
  courseName: string;
}

export interface Task {
  taskDTO: {
    id: number;
    contents: string;
    date: string;
    deadline: string;
    courseName: string;
  };
  users: [
    {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      firstLogin: boolean;
      profilePictureVersion: number;
      registrationDate: string;
      state: string;
    }
  ];
}

export interface Quiz {
  id: number;
  name: string;
  courseName: string;
}

const taskFormSchema: z.ZodSchema = z.object({
  contents: z.string({
    required_error: "Content is required",
  }),
  deadline: z.date({
    required_error: "Deadline is required",
  }),
});

const quizFormSchema: z.ZodSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
});

function getWeekdayNumber(dayName: string) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek.indexOf(dayName);
}

export default function Page({}) {
  const searchParams = useSearchParams();
  const currentUser = useCurrentUserContext();
  const courseId = searchParams.get("course");
  const [course, setCourse] = useState<Course | null>(null);
  const [isTeacherCourse, setIsTeacherCourse] = useState<boolean | null>(null);
  const [participants, setParticipants] = useState<Participant[] | null>(null);
  const [isUserCourse, setIsUserCourse] = useState<boolean | null>(null);
  const [courseResources, setCourseResources] = useState<
    CourseResource[] | null
  >(null);
  const [tasks, setTasks] = useState<Tasks[] | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [unsolvedTasks, setUnsolvedTasks] = useState<Task[] | null>(null);
  const [lateSolvedTasks, setLateSolvedTasks] = useState<Task[] | null>(null);
  const [date, setDate] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState<Date>(addDays(new Date(), 1));
  const [timeValue, setTimeValue] = useState<string>("00:00");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const taskForm = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      contents: "",
      deadline: new Date(),
    },
  });

  const quizForm = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchCourse = async () => {
    const response = await fetch(`/api/courses/courseById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: courseId }),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  };

  const fetchMyCoursesTeacher = async () => {
    try {
      const response = await fetch("/api/courses/myCoursesTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch my courses.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Courses fetch failed:", error);
    }
  };

  const fetchMyCoursesUser = async () => {
    try {
      const response = await fetch("/api/courses/myCourses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch my courses.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Courses fetch failed:", error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/courses/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchCourseResources = async () => {
    try {
      const response = await fetch(
        `/api/courseResources/getAllCourseResources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: courseId }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`/api/quizes/quizesFromCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/tasksFromCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchUnsolvedTasksData = async () => {
    try {
      const response = await fetch("/api/resources/myUnsolvedTasksTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch students unsolved tasks.");
      }
      const data = await response.json();
      const newData = data.map((task: Task) => {
        task.users.forEach((user: Participant) => {
          user.state = "0";
        });
        return task;
      });
      return newData;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchLateSolvedTasksData = async () => {
    try {
      const response = await fetch("/api/resources/myLateSolvedTasksTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch students late solved tasks.");
      }
      const data = await response.json();
      const newData = data.map((task: Task) => {
        task.users.forEach((user: Participant) => {
          user.state = "1";
        });
        return task;
      });
      return newData;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleRemoveUser = async (participantId: number) => {
    setButtonDisabled(true);
    const requestData = {
      courseId: courseId,
      id: participantId,
    };
    try {
      const response = await fetch(`/api/courses/removeParticipant`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      return response.json();
    } catch (error) {
      setButtonDisabled(false);
      console.error("Fetch failed:", error);
    }
  };

  const handleRemoveResource = async (downloadURL: string) => {
    setButtonDisabled(true);
    try {
      const response = await fetch(
        `/api/courseResources/removeResourceFromCourse`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ downloadURL }),
        }
      );
      if (response.ok) {
        window.location.reload();
        return;
      }
      return response.json();
    } catch (error) {
      setButtonDisabled(false);
      console.error("Fetch failed:", error);
    }
  };

  const handleDownload = async (downloadLink: string, fileName: string) => {
    try {
      const response = await fetch("/api/courseResources/download", {
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

  const handleAddCourseResource = async (e: any) => {
    e.preventDefault();
    setButtonDisabled(true);
    const formData = new FormData(e.currentTarget);
    if (courseId) {
      formData.append("id", courseId);
    }
    const file = formData.get("file") as File | null;
    if (!file || file.name === "") {
      setButtonDisabled(false);
      return;
    }

    try {
      const response = await fetch("/api/courseResources/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      return response;
    } catch (error) {
      setButtonDisabled(false);
      console.error("Fetch failed:", error);
    }
  };

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!selected) {
      setTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(selected, minutes), hours);
    setSelected(newSelectedDate);
    setTimeValue(time);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue || !date) {
      if (date) {
        setSelected(date);
      }
      return;
    }
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
    setSelected(newDate);
  };

  const handleApplyForCourse = async () => {
    try {
      const response = await fetch(`/api/invitations/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const onSubmitTask = async (values: z.infer<typeof taskFormSchema>) => {
    setButtonDisabled(true);
    const data = {
      courseId: course?.id,
      contents: values.contents,
      deadline: selected ? format(selected, "yyyy-MM-dd'T'HH:mm:ss") : "",
    };
    try {
      const response = await fetch("/api/tasks/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setButtonDisabled(false);
        setError(true);
        setSuccess(false);
        return;
      }
      setError(false);
      setSuccess(true);
      window.location.reload();
      return;
    } catch (error) {
      console.error("Add task failed:", error);
    }
  };

  const onSubmitQuiz = async (values: z.infer<typeof quizFormSchema>) => {
    setButtonDisabled(true);
    const data = {
      courseId: course?.id,
      name: values.name,
    };
    try {
      const response = await fetch("/api/quizes/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setButtonDisabled(false);
        setError(true);
        setSuccess(false);
        return;
      }
      setError(false);
      setSuccess(true);
      window.location.reload();
      return;
    } catch (error) {
      console.error("Add quiz failed:", error);
    }
  };

  useEffect(() => {
    if (currentUser.role === "TEACHER") {
      fetchCourse().then((data) => {
        if (data !== null) {
          setCourse(data);
          const dayName = data.date.split(" ")[0];
          setDate(getWeekdayNumber(dayName));
        } else {
          window.location.href = "/platform/coursesList";
        }
      });
      fetchMyCoursesTeacher().then((data) => {
        if (data) {
          const checkCourse: Course | undefined = data.find(
            (course: Course) => course.id === Number(courseId)
          );
          if (checkCourse) {
            setIsTeacherCourse(true);
            fetchParticipants().then((data) => {
              setParticipants(data);
            });
            fetchCourseResources().then((data) => {
              setCourseResources(data);
            });
            fetchQuizzes().then((data) => {
              setQuizzes(data);
            });
            fetchTasks().then((data) => {
              setTasks(data);
            });
            fetchUnsolvedTasksData().then((data) => {
              setUnsolvedTasks(data);
            });
            fetchLateSolvedTasksData().then((data) => {
              setLateSolvedTasks(data);
            });
          }
        }
      });
    } else if (currentUser.role === "ADMIN") {
      fetchCourse().then((data) => {
        setCourse(data);
        const dayName = data.date.split(" ")[0];
        setDate(getWeekdayNumber(dayName));
      });
    } else if (currentUser.role === "USER") {
      fetchCourse().then((data) => {
        if (data !== null) {
          setCourse(data);
          const dayName = data.date.split(" ")[0];
          setDate(getWeekdayNumber(dayName));
        } else {
          window.location.href = "/platform/coursesList";
        }
      });
      fetchMyCoursesUser().then((data) => {
        if (data) {
          const checkCourse: Course | undefined = data.find(
            (course: Course) => course.id === Number(courseId)
          );
          if (checkCourse) {
            setIsUserCourse(true);
            fetchParticipants().then((data) => {
              setParticipants(data);
            });
            fetchCourseResources().then((data) => {
              setCourseResources(data);
            });
            fetchQuizzes().then((data) => {
              setQuizzes(data);
            });
            fetchTasks().then((data) => {
              setTasks(data);
            });
          }
        }
      });
    }
  }, []);

  if (
    currentUser.role === "ADMIN" ||
    (currentUser.role === "USER" && !isUserCourse) ||
    (currentUser.role === "TEACHER" && !isTeacherCourse)
  ) {
    return (
      course?.id &&
      !isUserCourse &&
      !isTeacherCourse && (
        <div className="py-10 px-10 flex flex-col gap-4 h-full w-full justify-center items-center">
          <h1 className="text-4xl font-semibold text-nowrap">
            Welcome to {course?.name}
          </h1>
          <div className="mt-5 flex flex-row gap-2">
            <h2 className="font-semibold">Teacher: </h2>
            <h2 className="text-dark/80">
              {course?.author.firstName} {course?.author.lastName}
            </h2>
          </div>
          <div className="flex flex-row gap-2">
            <h2 className="font-semibold">Date: </h2>
            <h2 className="text-dark/80">{course?.date}</h2>
          </div>
          <Separator className="my-5 w-[400px]" />
          {currentUser.role === "USER" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"default"} onClick={handleApplyForCourse}>
                  Apply for course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    You have applied for the course! 🎉
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Check your courses invitations for more information. When
                    the teacher accepts your application, you will be able to
                    see the course.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction className="mt-3 w-[100px]">
                    Close
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="absolute bottom-0 right-0">
            <Image
              src="/course-info-img.svg"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
        </div>
      )
    );
  }

  if (course && participants && (isTeacherCourse || isUserCourse)) {
    return (
      <div className="py-10 px-10 flex flex-row gap-10 h-full w-full">
        <div className="w-full h-full flex flex-col gap-3 mb-3 max-w-[300px] text-nowrap">
          <h1 className="text-2xl font-semibold text-pretty">
            Welcome to {course?.name}
          </h1>
          <div className="mt-10 flex flex-row gap-2">
            <h2 className="font-semibold">Teacher: </h2>
            <h2 className="text-dark/80">
              {course?.author.firstName} {course?.author.lastName}
            </h2>
          </div>
          <Separator className="my-10" />
          <div className="flex flex-row gap-2">
            <h2 className="font-semibold">Zoom link: </h2>
            <Link className="text-dark/80" href={course?.zoomLink || ""}>
              {course?.zoomLink}
            </Link>
          </div>
          <div className="flex flex-row gap-2">
            <h2 className="font-semibold">Zoom passcode: </h2>
            <h2 className="text-dark/80">{course?.zoomPasscode}</h2>
          </div>
          <Separator className="my-10" />
          <ScrollArea className="max-h-[390px] w-full pr-4">
            <div className=" flex flex-row gap-2">
              <ScrollArea className="max-h-[300px] w-full pr-3">
                <div>
                  <h4 className="mb-4 font-semibold">Participants</h4>
                  {participants?.length === 0 && (
                    <h2 className="text-dark/80">No participants</h2>
                  )}
                  {participants?.map((participant) => (
                    <div key={participant.id}>
                      <div className="text-sm flex flex-row justify-between items-center">
                        <h2 className="text-dark/80">{`${participant.firstName} ${participant.lastName}`}</h2>
                        {currentUser?.role === "TEACHER" && (
                          <Button
                            variant="destructive"
                            size={"sm"}
                            disabled={buttonDisabled}
                            onClick={() => handleRemoveUser(participant.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Separator className="my-10" />

            <div className="flex flex-row gap-2">
              <ScrollArea className="max-h-[300px] w-full pr-3">
                <div>
                  <div className="sticky pb-4 top-0 bg-white z-10">
                    <h4 className="font-semibold mb-2">Course resources</h4>
                    {currentUser?.role === "TEACHER" && (
                      <form
                        onSubmit={handleAddCourseResource}
                        className="flex flex-row justify-start gap-2 items-center"
                      >
                        <Input type="file" name="file" />
                        <Button
                          variant={"default"}
                          size={"sm"}
                          type="submit"
                          disabled={buttonDisabled}
                        >
                          Upload
                        </Button>
                      </form>
                    )}
                  </div>

                  {courseResources?.length === 0 && (
                    <h2 className="text-dark/80">No resources</h2>
                  )}
                  {courseResources?.map((courseResource) => (
                    <div key={courseResource.uploadDate}>
                      <div className="text-sm flex flex-row justify-between items-center">
                        <Button
                          variant="link"
                          onClick={() =>
                            handleDownload(
                              courseResource.downloadURL,
                              courseResource.fileName
                            )
                          }
                          className="text-dark/80"
                        >
                          {courseResource.fileName}
                        </Button>
                        {currentUser?.role === "TEACHER" && (
                          <Button
                            variant="destructive"
                            size={"sm"}
                            disabled={buttonDisabled}
                            onClick={() =>
                              handleRemoveResource(courseResource.downloadURL)
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ScrollArea>
        </div>
        <Separator orientation="vertical" className="h-full" />
        <div className="w-full">
          <Tabs defaultValue="lessons" className="w-full ">
            <TabsList className="bg-background-light">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="quizes">Quizes</TabsTrigger>
            </TabsList>
            <Separator orientation="horizontal" className="w-full mb-4 mt-2" />
            <TabsContent value="lessons">
              <div className="flex flex-row justify-between items-center mb-10">
                <h1 className="text-2xl font-semibold text-nowrap">Lessons</h1>
                {currentUser?.role === "TEACHER" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"default"}>Add new lesson</Button>
                    </DialogTrigger>
                    <DialogContent className="!max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Add task to new lesson</DialogTitle>
                        <DialogDescription></DialogDescription>
                        {success ? (
                          <Alert
                            variant="default"
                            className="mb-2 border-logo-green"
                          >
                            <AlertCircle className="h-4 w-4" color="#6DA544" />
                            <AlertTitle className="text-logo-green">
                              Success
                            </AlertTitle>
                            <AlertDescription className="text-logo-green">
                              Task added successfully.
                            </AlertDescription>
                          </Alert>
                        ) : null}
                        {error ? (
                          <Alert variant="destructive" className="mb-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-logo-red">
                              Error
                            </AlertTitle>
                            <AlertDescription>
                              Couldn't add task. Please try again.
                            </AlertDescription>
                          </Alert>
                        ) : null}

                        <Form {...taskForm}>
                          <form
                            onSubmit={taskForm.handleSubmit(onSubmitTask)}
                            className="space-y-8"
                          >
                            <FormField
                              control={taskForm.control}
                              name="contents"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Task</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Task"
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={taskForm.control}
                              name="deadline"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Deadline</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !selected && "text-muted-foreground"
                                          )}
                                        >
                                          {selected ? (
                                            format(selected, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Label className="flex flex-row gap-2 text-nowrap items-center p-2">
                                        Set time:
                                        <Input
                                          type="time"
                                          className="pointer-events-auto w-auto"
                                          value={timeValue}
                                          onChange={handleTimeChange}
                                        />
                                      </Label>
                                      <Calendar
                                        mode="single"
                                        className="pointer-events-auto"
                                        selected={selected}
                                        onSelect={handleDaySelect}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              className="w-[120px]"
                              type="submit"
                              disabled={buttonDisabled}
                            >
                              Add task
                            </Button>
                          </form>
                        </Form>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="w-full mt-10">
                {lateSolvedTasks && unsolvedTasks && isTeacherCourse && (
                  <ScrollArea className="h-[640px] w-full pr-4">
                    {tasks?.map((task, index) => (
                      <LessonCard
                        key={index}
                        keyId={index + 1}
                        task={task}
                        userRole={currentUser?.role || ""}
                        studentsUnsolvedTasks={
                          unsolvedTasks?.filter(
                            (unsolvedTask) =>
                              unsolvedTask.taskDTO.id === task.id
                          ) || []
                        }
                        studentLateSolvedTasks={(lateSolvedTasks || []).filter(
                          (lateSolvedTask) =>
                            lateSolvedTask.taskDTO.id === task.id
                        )}
                        participants={participants}
                      ></LessonCard>
                    ))}
                  </ScrollArea>
                )}
                {isUserCourse && (
                  <ScrollArea className="h-[640px] w-full pr-4">
                    {tasks?.map((task, index) => (
                      <LessonCard
                        key={index}
                        keyId={index + 1}
                        task={task}
                        userRole={currentUser?.role || ""}
                        studentsUnsolvedTasks={
                          unsolvedTasks?.filter(
                            (unsolvedTask) =>
                              unsolvedTask.taskDTO.id === task.id
                          ) || []
                        }
                        studentLateSolvedTasks={(lateSolvedTasks || []).filter(
                          (lateSolvedTask) =>
                            lateSolvedTask.taskDTO.id === task.id
                        )}
                        participants={participants}
                      ></LessonCard>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </TabsContent>
            <TabsContent value="quizes">
              <div className="flex flex-row justify-between items-center mb-10">
                <h1 className="text-2xl font-semibold text-nowrap">Quizzes</h1>
                {currentUser?.role === "TEACHER" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"default"}>Add new quiz</Button>
                    </DialogTrigger>
                    <DialogContent className="!max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Add new quiz</DialogTitle>
                        <DialogDescription></DialogDescription>
                        {success ? (
                          <Alert
                            variant="default"
                            className="mb-2 border-logo-green"
                          >
                            <AlertCircle className="h-4 w-4" color="#6DA544" />
                            <AlertTitle className="text-logo-green">
                              Success
                            </AlertTitle>
                            <AlertDescription className="text-logo-green">
                              Quiz added successfully.
                            </AlertDescription>
                          </Alert>
                        ) : null}
                        {error ? (
                          <Alert variant="destructive" className="mb-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-logo-red">
                              Error
                            </AlertTitle>
                            <AlertDescription>
                              Couldn't add quiz. Please try again.
                            </AlertDescription>
                          </Alert>
                        ) : null}

                        <Form {...quizForm}>
                          <form
                            onSubmit={quizForm.handleSubmit(onSubmitQuiz)}
                            className="space-y-8"
                          >
                            <FormField
                              control={quizForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quiz name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Quiz name"
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              className="w-[120px]"
                              type="submit"
                              disabled={buttonDisabled}
                            >
                              Add quiz
                            </Button>
                          </form>
                        </Form>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="w-full mt-10">
                {quizzes && (
                  <ScrollArea className="h-[640px] w-full pr-4">
                    {quizzes?.map((quiz, index) => (
                      <QuizCard
                        key={index}
                        courseId={course?.id}
                        quiz={quiz}
                        userRole={currentUser?.role || ""}
                      ></QuizCard>
                    ))}
                  </ScrollArea>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <Separator orientation="vertical" className="h-full " />
        <div className="w-auto relative flex flex-col gap-10 items-end">
          <Calendar
            mode="single"
            selected={new Date()}
            showOutsideDays={false}
            modifiers={{
              booked: { dayOfWeek: date !== null ? [date] : [] },
            }}
            modifiersClassNames={{
              booked:
                "bg-logo-green text-background-light !rounded-[50%] hover:bg-logo-green hover:text-background-light",
            }}
            className="rounded-md border"
          />
          <div className="flex flex-row gap-2">
            <h2 className="font-semibold">Date of classes: </h2>
            <h2 className="text-dark/80">{course?.date}</h2>
          </div>
          <div className="absolute bottom-0 right-0">
            <Image
              src="/kid-yellow-img.svg"
              width={380}
              height={380}
              alt="Picture of the author"
            />
          </div>
        </div>
      </div>
    );
  }
}
