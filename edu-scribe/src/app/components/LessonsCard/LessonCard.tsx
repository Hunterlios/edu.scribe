"use client";
import React, { useState, useEffect, ChangeEventHandler } from "react";
import { columns, AllFromTask } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task, Tasks, Participant } from "@/app/platform/courses/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, setHours, setMinutes } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface SolvedTask {
  authorId: number;
  downloadURL: string;
  uploadDate: string;
  fileName: string;
  fileType: string;
}

const formSchema: z.ZodSchema = z.object({
  content: z.string({
    required_error: "Content is required",
  }),
  deadline: z.date({
    required_error: "Deadline is required",
  }),
});

const getAllFromTask = (task: Task): AllFromTask[] => {
  return task.users.map((user) => ({
    id: user.id,
    deadline: new Date(task.taskDTO.deadline)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "."),
    firstName: user.firstName,
    lastName: user.lastName,
    state: user.state,
  }));
};

const getAllFromTasks = (tasks: Task[]): AllFromTask[] => {
  return tasks.flatMap((task) => getAllFromTask(task));
};

export default function LessonCard({
  task,
  keyId,
  userRole,
  studentsUnsolvedTasks,
  studentLateSolvedTasks,
  participants,
}: {
  task: Tasks;
  keyId: number;
  userRole: string;
  studentsUnsolvedTasks: Task[];
  studentLateSolvedTasks: Task[];
  participants: Participant[];
}) {
  task.deadline = task.deadline.split("+")[0].replace("T", " ");
  task.deadline = format(new Date(task.deadline), "yyyy-MM-dd HH:mm");
  const isDeadline =
    new Date(task.deadline).toISOString() < new Date().toISOString();
  const [allTaskData, setAllTaskData] = useState<AllFromTask[] | null>(null);
  const [myFromTask, setMyFromTask] = useState<SolvedTask[] | null>(null);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState<Date>(new Date(task.deadline));
  const [timeValue, setTimeValue] = useState<string>(
    new Date(task.deadline).toLocaleTimeString("pl-PL")
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: task.contents,
      deadline: new Date(task.deadline),
    },
  });

  const fetchAllFromTaskData = async () => {
    try {
      const response = await fetch("/api/resources/allFromTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: task.id }),
      });

      if (!response.ok) {
        console.error("Couldn't fetch all from task.");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchMyFromTask = async () => {
    try {
      const response = await fetch("/api/resources/myFromTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: task.id }),
      });

      if (!response.ok) {
        console.error("Couldn't fetch my from task.");
      }
      const data = await response.json();

      return data;
    } catch (error) {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonDisable(true);

    const data = {
      id: task.id,
      content: values.content,
      deadline: selected ? format(selected, "yyyy-MM-dd HH:mm:ss.SSS000") : "",
    };

    try {
      const response = await fetch("/api/tasks/updateTask", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setButtonDisable(false);
        setError(true);
        setSuccess(false);
        return;
      }
      setError(false);
      setSuccess(true);
      window.location.reload();
    } catch (error) {
      console.error("Update task failed:", error);
    }
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

  const handleSubmitTask = async (e: any) => {
    e.preventDefault();
    setButtonDisable(true);

    const formData = new FormData(e.currentTarget);
    if (task.id) {
      formData.append("id", task.id.toString());
    }
    const file = formData.get("file") as File | null;
    if (!file || file.name === "") {
      setButtonDisable(false);
      return;
    }

    try {
      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      return response;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleDeleteTask = async () => {
    setButtonDisable(true);
    try {
      const response = await fetch(`/api/tasks/removeTask`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId: task.id }),
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      return response.json();
    } catch (error) {
      setButtonDisable(false);
      console.error("Fetch failed:", error);
    }
  };

  const handleRemoveResource = async (downloadURL: string) => {
    setButtonDisable(true);
    try {
      const response = await fetch(`/api/resources/removeResourceFromTask`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ downloadURL }),
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      return response.json();
    } catch (error) {
      setButtonDisable(false);
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    if (userRole === "TEACHER") {
      fetchAllFromTaskData().then((data: SolvedTask[]) => {
        const lateSolvedTasks = getAllFromTasks(studentLateSolvedTasks);
        const newData: AllFromTask[] = data
          .map((solvedTask: SolvedTask) => {
            const participant = participants.find(
              (participant: Participant) =>
                participant.id === solvedTask.authorId
            );

            if (!participant) {
              return undefined;
            }

            if (
              participant &&
              !lateSolvedTasks.some((task) => task.id === participant.id)
            ) {
              participant.state = "2";
              return {
                id: participant?.id,
                deadline: new Date(task.deadline)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "."),
                firstName: participant?.firstName,
                lastName: participant?.lastName,
                state: participant?.state,
                downloadURL: solvedTask.downloadURL,
                fileName: solvedTask.fileName,
                date: new Date(solvedTask.uploadDate)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "."),
              };
            } else if (
              participant &&
              lateSolvedTasks.some((task) => task.id === participant.id)
            ) {
              participant.state = "1";
              return {
                id: participant?.id,
                deadline: new Date(task.deadline)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "."),
                firstName: participant?.firstName,
                lastName: participant?.lastName,
                state: participant?.state,
                downloadURL: solvedTask.downloadURL,
                fileName: solvedTask.fileName,
                date: new Date(solvedTask.uploadDate)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "."),
              };
            }
          })
          .filter((task) => task !== undefined);
        setAllTaskData([...getAllFromTasks(studentsUnsolvedTasks), ...newData]);
      });
    }
    if (userRole === "USER") {
      fetchMyFromTask().then((data) => {
        setMyFromTask(data);
      });
    }
  }, []);

  if (!allTaskData && userRole === "TEACHER") {
    return (
      <div className="flex flex-col space-y-3 w-full mb-2">
        <Skeleton className="h-[135px] w-full rounded-xl" />
      </div>
    );
  }

  if (!myFromTask && userRole === "USER") {
    return (
      <div className="flex flex-col space-y-3 w-full mb-2">
        <Skeleton className="h-[135px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Lesson {keyId}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"default"}>Show task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Task: {task.contents}</DialogTitle>
                <DialogDescription className="flex flex-col gap-2 py-2">
                  {`Date: ${new Date(task.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, ".")}`}
                  <span
                    className={isDeadline ? "text-logo-red/90" : ""}
                  >{`Deadline: ${format(
                    new Date(task.deadline),
                    "dd.MM.yyyy HH:mm"
                  )}`}</span>
                </DialogDescription>
              </DialogHeader>
              {myFromTask && myFromTask.length > 0 && userRole === "USER" && (
                <DialogFooter>
                  <div className="flex flex-col gap-2">
                    {myFromTask.map((task: SolvedTask) => (
                      <div
                        key={task.downloadURL}
                        className="flex flex-row gap-1 items-center"
                      >
                        <Button
                          variant="link"
                          disabled={buttonDisable}
                          onClick={() =>
                            handleDownload(task.downloadURL, task.fileName)
                          }
                        >
                          {task.fileName}
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={buttonDisable}
                          size={"sm"}
                          onClick={() => handleRemoveResource(task.downloadURL)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogFooter>
              )}
              {myFromTask && myFromTask.length <= 0 && userRole === "USER" && (
                <DialogFooter>
                  <form
                    onSubmit={handleSubmitTask}
                    className="flex flex-row justify-start gap-2 items-center"
                  >
                    <Input type="file" name="file" className="w-[200px]" />
                    <Button
                      variant={"default"}
                      size={"sm"}
                      type="submit"
                      disabled={buttonDisable}
                    >
                      Submit
                    </Button>
                  </form>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
        {userRole === "TEACHER" && allTaskData && (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"ghost"}>Show students tasks</Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[1000px]">
                <DialogHeader>
                  <DialogTitle>Students tasks</DialogTitle>
                  <DialogDescription></DialogDescription>
                  <DataTable columns={columns} data={allTaskData} />
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"ghost"}>Edit leson</Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Edit task</DialogTitle>
                  <DialogDescription></DialogDescription>
                  {success ? (
                    <Alert variant="default" className="mb-2 border-logo-green">
                      <AlertCircle className="h-4 w-4" color="#6DA544" />
                      <AlertTitle className="text-logo-green">
                        Success
                      </AlertTitle>
                      <AlertDescription className="text-logo-green">
                        Task updated successfully.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  {error ? (
                    <Alert variant="destructive" className="mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-logo-red">Error</AlertTitle>
                      <AlertDescription>
                        Couldn't update task. Please try again.
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Task</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Task"
                                onChange={field.onChange}
                                defaultValue={task.contents}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
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
                        disabled={buttonDisable}
                      >
                        Update task
                      </Button>
                    </form>
                  </Form>
                  <Button
                    variant="destructive"
                    disabled={buttonDisable}
                    className="w-[120px] absolute right-5 bottom-5"
                    onClick={handleDeleteTask}
                  >
                    Delete task
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
