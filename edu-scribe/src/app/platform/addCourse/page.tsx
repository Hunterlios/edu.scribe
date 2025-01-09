"use client";
import React, { useState, ChangeEventHandler } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CalendarIcon,
  CircleHelp,
  SquarePlus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
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
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useCurrentUserContext } from "@/app/currentUserProvider";

const formSchema = z.object({
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

interface Course {
  name: string;
  zoomLink: string;
  zoomPasscode: string;
  date: string;
}

export default function AddCourse() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState<Date>(new Date());
  const [timeValue, setTimeValue] = useState<string>("00:00");
  const currentUser = useCurrentUserContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      zoomLink: "",
      zoomPasscode: "",
      date: new Date(),
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
      ...values,
      date: format(selected, "EEEE HH:mm"),
    };
    try {
      const response = await fetch("/api/courses/addCourse", {
        method: "POST",
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
      console.error("Add course failed:", error);
    }
  };

  if (currentUser?.role !== "TEACHER") {
    window.location.href = "/platform";
    return;
  }

  return (
    <div className="w-2/6 h-full px-12 py-12">
      <div className="flex flex-row gap-3 mb-6">
        <SquarePlus size={25} />
        <h1 className="text-xl font-semibold">Add course</h1>
      </div>
      {success ? (
        <Alert variant="default" className="mb-2 border-logo-green">
          <AlertCircle className="h-4 w-4" color="#6DA544" />
          <AlertTitle className="text-logo-green">Success</AlertTitle>
          <AlertDescription className="text-logo-green">
            Course added successfully.
          </AlertDescription>
        </Alert>
      ) : null}
      {error ? (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-logo-red">Error</AlertTitle>
          <AlertDescription>
            Couldn't add course. Please try again.
          </AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course name</FormLabel>
                <FormControl>
                  <Input placeholder="Course name" onChange={field.onChange} />
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
                  <Input placeholder="Zoom link" onChange={field.onChange} />
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
                        <CircleHelp className="h-4 w-4 cursor-pointer" />
                      </FormLabel>
                    </TooltipTrigger>
                    <TooltipContent className="w-[400px]">
                      <p>
                        Select the first date that the course will be held.
                        Later the course will be held on the same day of the
                        week.
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
                        className="w-auto"
                        value={timeValue}
                        onChange={handleTimeChange}
                      />
                    </Label>
                    <Calendar
                      mode="single"
                      className=""
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
            Add task
          </Button>
        </form>
      </Form>
      <div className="absolute right-0 bottom-0">
        <Image
          src="/kid-teacher-red-img.svg"
          width={600}
          height={600}
          alt="Picture of the author"
        />
      </div>
    </div>
  );
}
