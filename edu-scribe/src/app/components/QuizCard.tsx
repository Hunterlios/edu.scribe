"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "../platform/courses/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema: z.ZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function QuizCard({
  quiz,
  userRole,
  courseId,
}: {
  userRole: string;
  quiz: Quiz;
  courseId: number;
}) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: quiz.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      id: quiz.id,
      name: values.name,
    };

    try {
      const response = await fetch("/api/quizes/updateQuiz", {
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
      console.error("Update quiz failed:", error);
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const response = await fetch(`/api/quizes/removeQuiz`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: quiz.id }),
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      return response.json();
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  if (!quiz) {
    return (
      <div className="flex flex-col space-y-3 w-full mb-2">
        <Skeleton className="h-[135px] w-full rounded-xl" />
      </div>
    );
  }
  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Quiz: {quiz.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          <div className="flex gap-4">
            <Link href={`/platform/courses/quiz?quiz=${quiz.id}`}>
              <Button variant={"default"}>Show quiz</Button>
            </Link>
          </div>
          {userRole === "TEACHER" && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"}>Edit quiz</Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Edit quiz</DialogTitle>
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
                          Quiz updated successfully.
                        </AlertDescription>
                      </Alert>
                    ) : null}
                    {error ? (
                      <Alert variant="destructive" className="mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-logo-red">Error</AlertTitle>
                        <AlertDescription>
                          Couldn't update quiz. Please try again.
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
                              <FormLabel>Quiz name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Quiz name"
                                  onChange={field.onChange}
                                  defaultValue={quiz.name}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button className="w-[120px]">Update quiz</Button>
                      </form>
                    </Form>
                    <Button
                      variant="destructive"
                      className="w-[120px] absolute right-5 bottom-5"
                      onClick={handleDeleteQuiz}
                    >
                      Delete quiz
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
