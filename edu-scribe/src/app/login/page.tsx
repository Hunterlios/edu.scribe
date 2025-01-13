"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PasswordInput from "@/app/components/PasswordInput";
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Logo from "../components/Logo";

const formSchema = z.object({
  email: z.string().email({
    message: "This is not a valid email.",
  }),
  password: z
    .string()
    .min(2, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
});

export default function Login() {
  const [error, setError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonDisabled(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setButtonDisabled(false);
        setError(true);
        return;
      }

      router.push("/platform");
      return;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="h-screen w-auto">
      <div className="w-full h-full flex justify-center items-center">
        <div className="absolute left-0 right-0 top-10 m-auto w-fit select-none pointer-events-none blur-[1px]">
          <Image
            src="/hero-background.svg"
            width={1600}
            height={600}
            alt="Picture of the author"
          />
        </div>
        <div className="z-10 bg-white outline outline-dark/5 w-[700px] h-[550px] flex flex-col justify-center items-center shadow-xl rounded-xl">
          <div className="w-full px-40">
            {/* Dodanie stylowania logo */}
            <div className="flex flex-row justify-center mb-10">
              <Logo />
            </div>
            {error ? (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-logo-red">Error</AlertTitle>
                <AlertDescription>
                  Wrong email or password. Please try again.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email" />
                      </FormControl>
                      <FormDescription>
                        Enter your email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl {...field}>
                        <PasswordInput field={field} placeholder="Password" />
                      </FormControl>
                      <FormDescription>Enter your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between">
                  <Button
                    className="w-[120px] h-[40px]"
                    type="submit"
                    disabled={buttonDisabled}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-[120px] h-[40px]"
                    variant="outline"
                    disabled={buttonDisabled}
                    type="button"
                    asChild
                  >
                    <Link className="" href="/register">
                      Get access
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
