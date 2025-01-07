"use client";
import React, { useState } from "react";
import Image from "next/image";
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
import Logo from "../components/Logo";
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

export default function Register() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setError(true);
        setSuccess(false);
        return;
      }
      setError(false);
      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  return (
    <div className="h-screen w-auto">
      <div className="w-full h-full flex justify-start items-center">
        <div className="absolute right-24 top-24 m-auto w-fit select-none pointer-events-none blur-[1px]">
          <Image
            src="/hero-background.svg"
            width={1400}
            height={600}
            alt="Picture of the author"
          />
        </div>
        <div className="z-10 bg-white outline outline-dark/5 w-[1230px] h-[750px] flex flex-row gap-20 justify-between items-center shadow-xl rounded-r-lg">
          <div className="w-full pl-20">
            {/* TODO: Dodanie stylowania logo */}
            <div className="flex flex-row justify-start mb-10">
              <Logo />
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormDescription>Enter your name</FormDescription>
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
                      <FormDescription>Enter your surname</FormDescription>
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
                      <FormDescription>
                        Enter your email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-[120px]" type="submit">
                  Get access
                </Button>
              </form>
            </Form>
          </div>
          <div className="w-full pr-20 flex flex-col gap-10 items-center justify-center">
            <div className="flex flex-col gap-5">
              <h1 className="text-4xl font-bold">How to get access?</h1>
              <p className="text-dark/80">
                If you want to get access to our platform you must first fill up
                this short form. We will send an email with more information
                about your account.
              </p>
            </div>
            <Image
              src="/register-form-img.svg"
              width={400}
              height={400}
              alt="Picture of the author"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
