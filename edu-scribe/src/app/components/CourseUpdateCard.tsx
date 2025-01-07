"use client";
import React, { useState, ChangeEventHandler } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { AlertCircle, CalendarIcon, CircleHelp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse, setHours, setMinutes } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Course } from "../platform/myCourses/columns-teacher";

const formSchema: z.ZodSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name must be at least 1 character long"),
  zoomLink: z
    .string({
      required_error: "Zoom link is required",
    })
    .min(1, "Zoom link must be at least 1 character long"),
  zoomPasscode: z
    .string({
      required_error: "Passcode is required",
    })
    .min(1, "Passcode must be at least 1 character long"),
  date: z.date({
    required_error: "Date is required",
  }),
});

function parseCustomDate(input: string) {
  const cleanedInput = input.replace(".", ":");
  const baseDate = new Date();
  const dayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };
  const [day, time] = cleanedInput.split(" ");
  const dayOffset = dayMap[day as keyof typeof dayMap];

  if (dayOffset === undefined) {
    throw new Error(`Invalid day: ${day}`);
  }
  const adjustedDate = new Date(baseDate);
  const currentDay = baseDate.getDay();
  const dayDifference = dayOffset - currentDay;

  adjustedDate.setDate(baseDate.getDate() + dayDifference);

  const fullDateString = `${
    adjustedDate.toISOString().split("T")[0]
  } ${time}:00`;
  const parsedDate = parse(fullDateString, "yyyy-MM-dd HH:mm:ss", new Date());

  return parsedDate;
}

export default function CourseUpdateCard({ course }: { course: Course }) {
  const { id, name, date, zoomLink, zoomPasscode } = course;
  const newDate = parseCustomDate(date);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState<Date>(new Date(newDate));
  const [timeValue, setTimeValue] = useState<string>(
    new Date(newDate).toLocaleTimeString("pl-PL")
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      zoomLink: zoomLink,
      zoomPasscode: zoomPasscode,
      date: new Date(newDate),
    },
  });

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
    const data = {
      id: id,
      name: values.name,
      zoomLink: values.zoomLink,
      zoomPasscode: values.zoomPasscode,
      date: format(selected, "EEEE HH:mm"),
    };

    try {
      const response = await fetch("/api/courses/updateCourse", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setError(true);
        setSuccess(false);
        return;
      }
      setError(false);
      setSuccess(true);
      window.location.reload();
    } catch (error) {
      console.error("Update user failed:", error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="secondary" className="w-[80px] z-50">
            Update
          </Button>
        </DialogTrigger>
        <DialogContent className="!max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription></DialogDescription>
            {success ? (
              <Alert variant="default" className="mb-2 border-logo-green">
                <AlertCircle className="h-4 w-4" color="#6DA544" />
                <AlertTitle className="text-logo-green">Success</AlertTitle>
                <AlertDescription className="text-logo-green">
                  Course updated successfully.
                </AlertDescription>
              </Alert>
            ) : null}
            {error ? (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-logo-red">Error</AlertTitle>
                <AlertDescription>
                  Couldn't update course. Please try again.
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Course name"
                          onChange={field.onChange}
                          defaultValue={name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zoomLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zoom link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Course name"
                          onChange={field.onChange}
                          defaultValue={zoomLink}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zoomPasscode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zoom passcode</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Zoom passcode"
                          onChange={field.onChange}
                          defaultValue={zoomPasscode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="flex flex-row items-center gap-2">
                              Date
                              <CircleHelp className="h-4 w-4 cursor-pointer text-dark/80" />
                            </FormLabel>
                          </TooltipTrigger>
                          <TooltipContent align="start" className="w-[400px]">
                            <p>
                              Select the first date that the course will be
                              held. Later the course will be held on the same
                              day of the week.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                <Button className="w-[120px]" type="submit">
                  Update course
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
