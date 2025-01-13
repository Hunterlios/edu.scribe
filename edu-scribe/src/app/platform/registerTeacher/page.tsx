"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UserPlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  firstName: z
    .string()
    .regex(RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)*$/), {
      message: "Name must not contain any special characters or numbers.",
    }),
  lastName: z
    .string()
    .regex(RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)*$/), {
      message: "Surname must not contain any special characters or numbers.",
    }),
  email: z.string().email({
    message: "This is not a valid email.",
  }),
});

export default function RegisterTeacher() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonDisabled(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setButtonDisabled(false);
        setError(true);
        setSuccess(false);
        return;
      }
      setError(false);
      setSuccess(true);
      form.reset();
      return;
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="w-2/6 h-full px-12 py-12">
      <div className="flex flex-row gap-3 mb-6">
        <UserPlus size={25} />
        <h1 className="text-xl font-semibold">Register Teacher</h1>
      </div>
      {success ? (
        <Alert variant="default" className="mb-2 border-logo-green">
          <AlertCircle className="h-4 w-4" color="#6DA544" />
          <AlertTitle className="text-logo-green">Success</AlertTitle>
          <AlertDescription className="text-logo-green">
            Teacher registered successfully.
          </AlertDescription>
        </Alert>
      ) : null}
      {error ? (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-logo-red">Error</AlertTitle>
          <AlertDescription>
            Couldn't register teacher. Please try again.
          </AlertDescription>
        </Alert>
      ) : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>Enter teacher name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Surname" {...field} />
                </FormControl>
                <FormDescription>Enter teacher surname</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>Enter teacher email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-[120px]" type="submit">
            Register
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
