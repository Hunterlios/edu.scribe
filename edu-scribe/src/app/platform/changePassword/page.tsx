"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import PasswordInput from "@/app/components/PasswordInput";
import { AlertCircle, LockKeyhole } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

const formSchema: z.ZodSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters")
      .regex(
        RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        ),
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters")
      .regex(
        RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        ),
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Confirm password must match new password",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export default function ChangePassword() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    try {
      const response = await fetch("/api/users/changePassword", {
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
      console.error("Password change failed:", error);
    }
  };

  return (
    <div className="w-[1000px] h-full px-12 py-12 flex flex-row justify-between items-start gap-20">
      <div className="flex flex-col gap-3 mb-6 w-[300px]">
        <div className="flex gap-3 mb-3">
          <LockKeyhole size={25} />
          <h1 className="text-xl font-semibold">Change password</h1>
        </div>

        {success ? (
          <Alert variant="default" className="mb-2 border-logo-green">
            <AlertCircle className="h-4 w-4" color="#6DA544" />
            <AlertTitle className="text-logo-green">Success</AlertTitle>
            <AlertDescription className="text-logo-green">
              Password changed successfully.
            </AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-logo-red">Error</AlertTitle>
            <AlertDescription>
              Couldn't change password. Check your current password.
            </AlertDescription>
          </Alert>
        ) : null}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl {...field}>
                    <PasswordInput field={field} />
                  </FormControl>
                  <FormDescription>Enter your current password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl {...field}>
                    <PasswordInput field={field} />
                  </FormControl>
                  <FormDescription>Enter new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl {...field}>
                    <PasswordInput field={field} />
                  </FormControl>
                  <FormDescription>Confirm new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-[150px]" type="submit">
              Change password
            </Button>
          </form>
        </Form>

        <div className="absolute right-0 bottom-0">
          <Image
            src="/change-password-img.svg"
            width={550}
            height={550}
            alt=""
          />
        </div>
      </div>
      <Separator orientation="vertical" className="h-[500px]" />
      <div className="w-[400px] flex flex-col gap-10 items-center justify-center text-pretty">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold">Password rules</h1>
          <ul className="list-disc space-y-2">
            <li className="text-dark/80">
              Password must be at least 8 characters
            </li>
            <li className="text-dark/80">
              Password must be at most 20 characters
            </li>
            <li className="text-dark/80">
              Password must contain at least one uppercase letter, one lowercase
              letter, one number and one special character
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
