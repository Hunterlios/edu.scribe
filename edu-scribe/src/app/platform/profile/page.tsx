"use client";
import React, { useState } from "react";
import { useCurrentUserContext } from "../../currentUserProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, UserCog } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AvatarHoverCard from "@/app/components/AvatarHoverCard";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  firstName: z
    .string()
    .optional()
    .or(
      z
        .string()
        .max(50, "Name must be at most 20 characters.")
        .regex(RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)*$/), {
          message: "Name must not contain any special characters or numbers.",
        })
    ),

  lastName: z
    .string()
    .optional()
    .or(
      z
        .string()
        .max(50, "Surname must be at most 20 characters.")
        .regex(RegExp(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)*$/), {
          message:
            "Surname must not contain any special characters or numbers.",
        })
    ),

  email: z
    .string()
    .optional()
    .or(
      z.string().email({
        message: "This is not a valid email.",
      })
    ),

  profilePictureVersion: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(
          RegExp(/^[1-8]$/),
          "This is not a valid profile picture version."
        )
    ),
});

export default function Profile() {
  const currentUser = useCurrentUserContext();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email,
      profilePictureVersion: currentUser?.profilePictureVersion.toString(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      id: currentUser?.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      profilePictureVersion: parseInt(values.profilePictureVersion || "1"),
    };
    try {
      const response = await fetch("/api/users/updateUser", {
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
    <div className="w-[1000px] h-full px-12 py-12 flex flex-row justify-between items-start gap-20">
      <div className="flex flex-col gap-3 mb-6 w-[300px]">
        <div className="flex gap-3 mb-3">
          <UserCog size={25} />
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>

        {success ? (
          <Alert variant="default" className="mb-2 border-logo-green">
            <AlertCircle className="h-4 w-4" color="#6DA544" />
            <AlertTitle className="text-logo-green">Success</AlertTitle>
            <AlertDescription className="text-logo-green">
              Profile updated successfully.
            </AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-logo-red">Error</AlertTitle>
            <AlertDescription>
              Couldn't update profile. Please try again.
            </AlertDescription>
          </Alert>
        ) : null}
        {currentUser?.profilePictureVersion && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        onChange={field.onChange}
                        defaultValue={currentUser.firstName}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Surname"
                        onChange={field.onChange}
                        defaultValue={currentUser.lastName}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Email"
                        onChange={field.onChange}
                        defaultValue={currentUser.email}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profilePictureVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-auto gap-2 h-auto py-1">
                          <SelectValue
                            placeholder={
                              <AvatarHoverCard
                                i={currentUser.profilePictureVersion}
                              />
                            }
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent className=" w-auto overflow-visible">
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 1
                            }
                            value="1"
                          >
                            {<AvatarHoverCard i={1}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 2
                            }
                            value="2"
                          >
                            {<AvatarHoverCard i={2}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 3
                            }
                            value="3"
                          >
                            {<AvatarHoverCard i={3}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 4
                            }
                            value="4"
                          >
                            {<AvatarHoverCard i={4}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 5
                            }
                            value="5"
                          >
                            {<AvatarHoverCard i={5}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 6
                            }
                            value="6"
                          >
                            {<AvatarHoverCard i={6}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 7
                            }
                            value="7"
                          >
                            {<AvatarHoverCard i={7}></AvatarHoverCard>}
                          </SelectItem>
                          <SelectItem
                            defaultChecked={
                              currentUser.profilePictureVersion === 8
                            }
                            value="8"
                          >
                            {<AvatarHoverCard i={8}></AvatarHoverCard>}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-[120px]" type="submit">
                Update profile
              </Button>
            </form>
          </Form>
        )}
        <div className="absolute right-0 bottom-0">
          <Image
            src="/profile-page-img.svg"
            width={600}
            height={600}
            alt="Picture of the author"
          />
        </div>
      </div>
      <Separator orientation="vertical" className="h-[500px]" />
      <div className="w-[400px] flex flex-col gap-10 items-center justify-center text-pretty">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold">
            How to change profile informations?
          </h1>
          <p className="text-dark/80">
            If you want to change your profile informations you must change
            whatever information you want and then click on the "Update profile"
            button.
          </p>
        </div>
      </div>
    </div>
  );
}
