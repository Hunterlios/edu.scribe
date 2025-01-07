"use client";
import React, { useEffect, useState } from "react";
import { BellRing, UserCheck, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useCurrentUserContext } from "../currentUserProvider";
import Link from "next/link";

interface User {
  id: number;
  requestDate: string;
}

interface Invitation {
  course: string;
  courseId: number;
  date: string;
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    firstLogin: boolean;
    profilePictureVersion: number;
    registrationDate: string;
  };
}

export default function Platform() {
  const [requests, setRequests] = useState([]);
  const currentUser = useCurrentUserContext();

  const getNotificationsAdmin = async () => {
    try {
      const response = await fetch("/api/auth/requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch users.");
      }
      let data = await response.json();
      data = data.map((user: User) => {
        return {
          id: user.id,
          requestDate: new Date(user.requestDate)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "."),
        };
      });
      setRequests(data);
    } catch (error) {
      console.error("Users fetch failed:", error);
    }
  };

  const getNotificationsTeacher = async () => {
    try {
      const response = await fetch("/api/invitations/myInvitationsTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch invitations requests.");
      }
      let data = await response.json();

      data = data?.map((invitation: Invitation) => {
        return {
          courseId: invitation.courseId,
          course: invitation.course,
          date: new Date(invitation.date)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "."),
        };
      });
      setRequests(data);
    } catch (error) {
      console.error("Invitations requests fetch failed:", error);
    }
  };

  useEffect(() => {
    if (currentUser.role === "ADMIN") {
      getNotificationsAdmin();
    } else if (currentUser.role === "TEACHER") {
      getNotificationsTeacher();
    }
  }, []);

  return (
    <div className="w-full h-full">
      {currentUser.role === "ADMIN" && (
        <div className="w-full h-full px-10 py-10">
          <h1 className="text-5xl font-extrabold">
            Hi {currentUser?.firstName}! 👋
          </h1>
          <div className="flex flex-row gap-4 justify-between mt-10">
            <div>CHART 1</div>
            <div>CHART 2</div>
            <div className="flex flex-col gap-4 w-[320px]">
              <div className="flex flex-row gap-2 items-center justify-end">
                <BellRing size={20} />
                <h1 className="font-semibold text-xl">Notifications</h1>
              </div>
              {requests.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <Card>
                    <CardContent className="p-4 h-full">
                      <CardDescription className="h-full flex flex-row gap-4 items-center">
                        <div className="h-full flex items-start justify-center">
                          <span className="w-[40px] h-[40px] bg-logo-green rounded-full flex items-center justify-center">
                            <BellRing
                              size={20}
                              className="text-background-light"
                            />
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h1 className="text-sm font-semibold">
                            No notifications
                          </h1>
                          <h2>You have no new notifications.</h2>
                        </div>
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[...(requests as User[])]
                    .reverse()
                    .slice(0, 3)
                    .map((request) => (
                      <Link href="/platform/addUser" key={request.id}>
                        <Card>
                          <CardContent className="p-4 h-full">
                            <CardDescription className="h-full flex flex-row gap-4 items-center">
                              <div className="h-full flex items-start justify-center">
                                <span className="w-[40px] h-[40px] bg-dark rounded-full flex items-center justify-center">
                                  <UserCheck
                                    size={20}
                                    className="text-background-light"
                                  />
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <h1 className="text-sm font-semibold">
                                  New user request
                                </h1>
                                <h2>You have a new user request.</h2>

                                <div className="flex flex-row gap-1 items-center">
                                  <CalendarDays size={16} />
                                  {request.requestDate}
                                </div>
                              </div>
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row mt-10">
            <div>CHART 3</div>
          </div>
        </div>
      )}

      {currentUser.role === "TEACHER" && (
        <div className="w-full h-full px-10 py-10">
          <h1 className="text-5xl font-extrabold">
            Hi {currentUser?.firstName}! 👋
          </h1>
          <div className="flex flex-row gap-4 justify-between mt-10">
            <div>CHART 1</div>
            <div>CHART 2</div>
            <div className="flex flex-col gap-4 w-[320px]">
              <div className="flex flex-row gap-2 items-center justify-end">
                <BellRing size={20} />
                <h1 className="font-semibold text-xl">Notifications</h1>
              </div>
              {requests.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <Card>
                    <CardContent className="p-4 h-full">
                      <CardDescription className="h-full flex flex-row gap-4 items-center">
                        <div className="h-full flex items-start justify-center">
                          <span className="w-[40px] h-[40px] bg-logo-green rounded-full flex items-center justify-center">
                            <BellRing
                              size={20}
                              className="text-background-light"
                            />
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h1 className="text-sm font-semibold">
                            No notifications
                          </h1>
                          <h2>You have no new notifications.</h2>
                        </div>
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[...(requests as Invitation[])]
                    .reverse()
                    .slice(0, 3)
                    .map((request) => (
                      <Link
                        href="/platform/coursesInvitations"
                        key={request.courseId}
                      >
                        <Card>
                          <CardContent className="p-4 h-full">
                            <CardDescription className="h-full flex flex-row gap-4 items-center">
                              <div className="h-full flex items-start justify-center">
                                <span className="w-[40px] h-[40px] bg-dark rounded-full flex items-center justify-center">
                                  <UserCheck
                                    size={20}
                                    className="text-background-light"
                                  />
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <h1 className="text-sm font-semibold">
                                  New invitation request
                                </h1>
                                <h2>
                                  {`You have a new invitation request to ${request.course} course.`}
                                </h2>

                                <div className="flex flex-row gap-1 items-center">
                                  <CalendarDays size={16} />
                                  {request.date}
                                </div>
                              </div>
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row mt-10">
            <div>CHART 3</div>
          </div>
        </div>
      )}

      {currentUser.role === "STUDENT" && (
        <div className="w-full h-full px-10 py-10">
          <h1 className="text-5xl font-extrabold">
            Hi {currentUser?.firstName}! 👋
          </h1>
          <div className="flex flex-row gap-4 justify-between mt-10">
            <div>CHART 1</div>
            <div>CHART 2</div>
            <div className="flex flex-col gap-4 w-[320px]">
              <div className="flex flex-row gap-2 items-center justify-end">
                <BellRing size={20} />
                <h1 className="font-semibold text-xl">Notifications</h1>
              </div>
              {requests.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <Card>
                    <CardContent className="p-4 h-full">
                      <CardDescription className="h-full flex flex-row gap-4 items-center">
                        <div className="h-full flex items-start justify-center">
                          <span className="w-[40px] h-[40px] bg-logo-green rounded-full flex items-center justify-center">
                            <BellRing
                              size={20}
                              className="text-background-light"
                            />
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h1 className="text-sm font-semibold">
                            No notifications
                          </h1>
                          <h2>You have no new notifications.</h2>
                        </div>
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[...(requests as User[])]
                    .reverse()
                    .slice(0, 3)
                    .map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-4 h-full">
                          <CardDescription
                            className="h-full flex flex-row gap-4 items-center"
                            key={request.id}
                          >
                            <div className="h-full flex items-start justify-center">
                              <span className="w-[40px] h-[40px] bg-dark rounded-full flex items-center justify-center">
                                <UserCheck
                                  size={20}
                                  className="text-background-light"
                                />
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <h1 className="text-sm font-semibold">
                                New user request
                              </h1>
                              <h2>You have a new user request.</h2>

                              <div className="flex flex-row gap-1 items-center">
                                <CalendarDays size={16} />
                                {request.requestDate}
                              </div>
                            </div>
                          </CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row mt-10">
            <div>CHART 3</div>
          </div>
        </div>
      )}
    </div>
  );
}
