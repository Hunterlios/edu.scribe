"use client";
import React, { useEffect, useState } from "react";
import {
  BellRing,
  UserCheck,
  CalendarDays,
  CalendarClock,
  MessageCircleQuestion,
} from "lucide-react";
import { useCurrentUserContext } from "../currentUserProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Course, columns } from "./columns";
import { DataTable } from "./data-table";
import { Separator } from "@/components/ui/separator";

interface CourseData {
  [key: string]: number;
}

interface DateCharteData {
  [key: string]: number;
}

interface ChartData {
  course: string;
  students: number;
  fill: string;
}

interface DateChartData {
  date: string;
  users: number;
  fill: string;
}

const chartConfig = {
  students: {
    label: "Students",
  },
  english: {
    label: "English",
    color: "hsl(var(--chart-1))",
  },
  italiano: {
    label: "Italiano",
    color: "hsl(var(--chart-2))",
  },
  francais: {
    label: "Français",
    color: "hsl(var(--chart-3))",
  },
  deutsh: {
    label: "Deutsch",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const dateChartConfig = {
  users: {
    label: "Registered Users",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const colorMap: { [key: string]: string } = {
  English: "var(--color-english)",
  Italiano: "var(--color-italiano)",
  Francais: "var(--color-francais)",
  Deutsh: "var(--color-deutsh)",
};

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

interface UrgentTask {
  id: number;
  courseName: string;
  date: string;
  deadline: string;
  contents: string;
}

const formatChartData = (data: CourseData): ChartData[] => {
  return Object.entries(data)
    .map(([course, students]) => {
      const [language] = course.split(" ");
      return {
        course,
        students,
        fill: colorMap[language] || "var(--color-primary)",
      };
    })
    .sort((a, b) => a.course.localeCompare(b.course));
};

const formatDateChartData = (data: DateCharteData): DateChartData[] => {
  return Object.entries(data)
    .map(([date, users]) => {
      return {
        date,
        users,
        fill: "hsl(var(--chart-1))",
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
};

export default function Platform() {
  const [requests, setRequests] = useState([]);
  const currentUser = useCurrentUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dateChartData, setDateChartData] = useState<DateChartData[]>([]);
  const total = dateChartData.reduce((acc, { users }) => acc + users, 0);

  const fetchMyCoursesTeacher = async () => {
    try {
      const response = await fetch("/api/courses/myCoursesTeacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch courses.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const fetchMyCoursesUser = async () => {
    try {
      const response = await fetch("/api/courses/myCourses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch courses.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const getChartData = async () => {
    try {
      const response = await fetch("/api/courses/courseChart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch data.");
      }
      const data = await response.json();
      setChartData(formatChartData(data));
    } catch (error) {
      console.error("Data fetch failed:", error);
    }
  };

  const getDateChartData = async () => {
    try {
      const response = await fetch("/api/auth/dateChart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch data.");
      }
      const data = await response.json();
      setDateChartData(formatDateChartData(data));
    } catch (error) {
      console.error("Data fetch failed:", error);
    }
  };

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
          id: invitation.id,
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

  const getNotificationsUser = async () => {
    try {
      const response = await fetch("/api/tasks/myUrgentTasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Couldn't fetch urgent tasks.");
      }
      let data = await response.json();

      data = data?.map((urgentTask: UrgentTask) => {
        return {
          id: urgentTask.id,
          courseName: urgentTask.courseName,
          contents: urgentTask.contents,
          date: new Date(urgentTask.date),
          deadline: new Date(urgentTask.deadline)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "."),
        };
      });
      setRequests(data);
    } catch (error) {
      console.error("Urgent tasks fetch failed:", error);
    }
  };

  useEffect(() => {
    if (currentUser.firstLogin) {
      setIsOpen(true);
    }
    if (currentUser.role === "ADMIN") {
      getNotificationsAdmin();
      getChartData();
      getDateChartData();
    } else if (currentUser.role === "TEACHER") {
      getNotificationsTeacher();
      fetchMyCoursesTeacher().then((data) => {
        setCourses(data);
      });
    } else if (currentUser.role === "USER") {
      getNotificationsUser();
      fetchMyCoursesUser().then((data) => {
        setCourses(data);
      });
    }
  }, []);

  return (
    requests && (
      <div>
        {currentUser.firstLogin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center font-semibold">
                  Welcome to the platform {currentUser.firstName}! 👋
                </DialogTitle>
                <DialogDescription className="text-center">
                  <br />
                  <br />
                  We're excited to have you here! Remember to keep your account
                  secure by updating your password regularly. <br /> <br />
                  💡 Note: If you haven’t changed your default password yet,
                  please take a moment to do so now to protect your account.
                  <br />
                  <br />
                  Enjoy your time on the platform! 😊
                </DialogDescription>
              </DialogHeader>
              <Link
                className="flex justify-center"
                href="/platform/changePassword"
              >
                <Button className="w-auto mt-2">Change password</Button>
              </Link>
            </DialogContent>
          </Dialog>
        )}

        {currentUser.role === "ADMIN" && (
          <div className="w-full h-full px-10 py-10">
            <h1 className="text-5xl font-extrabold">
              Hi {currentUser?.firstName}! 👋
            </h1>
            <div className="flex flex-row gap-4 justify-between mt-10">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Language Course Enrollment</CardTitle>
                  <CardDescription>
                    Number of students per course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[350px] w-[1000px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="course"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tick={({ x, y, payload }) => (
                          <g transform={`translate(${x},${y})`}>
                            <text
                              x={0}
                              y={0}
                              dy={16}
                              textAnchor="end"
                              fill="#888"
                              transform="rotate(-45)"
                            >
                              {payload.value}
                            </text>
                          </g>
                        )}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={90}
                        tickFormatter={(value) => `${value} students`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Bar
                        dataKey="students"
                        fill="var(--color-primary)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <div></div>
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
            <div>
              <Card className="w-full mx-auto flex flex-row justify-between items-center">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>New User Registrations</CardTitle>
                    <CardDescription>
                      Showing registered users for the last 2 months
                    </CardDescription>
                  </div>
                  <div className="flex">
                    <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:px-8 sm:py-6">
                      <span className="text-xs text-muted-foreground">
                        {dateChartConfig.users.label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-6 overflow-x-auto">
                  <ChartContainer
                    config={chartConfig}
                    className="h-[100px] w-full min-w-[1200px]"
                  >
                    <BarChart
                      accessibilityLayer
                      data={dateChartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        allowDecimals={false}
                        tickFormatter={(value) =>
                          value > 0 ? value.toLocaleString() : ""
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="users"
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              );
                            }}
                          />
                        }
                      />
                      <Bar dataKey="users" fill={`var(--color-users)`} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentUser.role === "TEACHER" && (
          <div className="w-full h-full px-10 py-10">
            <h1 className="text-5xl font-extrabold">
              Hi {currentUser?.firstName}! 👋
            </h1>
            <div className="flex flex-row gap-4 justify-between mt-10">
              <div className="w-[1000px] h-[600px]">
                <DataTable columns={columns} data={courses} />
              </div>
              <Separator orientation="vertical" className="h-[660px] mx-10" />
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
                      .slice(0, 2)
                      .map((request) => (
                        <Link
                          href="/platform/coursesInvitations"
                          key={request.id}
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
            <div className="absolute right-0 bottom-0">
              <Image
                src="/yellow-kid-learning-img.svg"
                width={420}
                height={420}
                alt="Picture of the author"
              />
            </div>
          </div>
        )}

        {currentUser.role === "USER" && (
          <div className="w-full h-full px-10 py-5">
            <div className="flex flex-row w-full justify-between items-center">
              <h1 className="text-5xl font-extrabold">
                Hi {currentUser?.firstName}! 👋
              </h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"link"}
                    className="w-auto flex flex-row items-center justify-center"
                  >
                    Need help
                    <MessageCircleQuestion size={20} className="mb-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-semibold text-2xl">
                      How to navigate the plarform
                    </DialogTitle>
                    <DialogDescription className="text-dark/80 text-base">
                      One the left of the screen there is a sidebar that
                      contains all shortcuts you need.
                    </DialogDescription>
                  </DialogHeader>

                  <ul className="flex flex-col gap-6 mt-6 mb-10">
                    <li>
                      <h1 className="text-lg font-semibold mb-2">
                        1. Sidebar navigation
                      </h1>
                      <p className="text-dark/80">
                        One the left of the screen there is a sidebar that
                        contains all shortcuts you need.
                      </p>
                    </li>
                    <li>
                      <h1 className="text-lg font-semibold mb-2">
                        2. User account
                      </h1>
                      <p className="text-dark/80">
                        If you want to access your personal account information,
                        just click the avatar in top right corner of the
                        platform.
                      </p>
                    </li>
                    <li>
                      <h1 className="text-lg font-semibold mb-2">
                        3. Notifications
                      </h1>
                      <p className="text-dark/80">
                        Notifications are located in the right side of the
                        platform and contain all tasks you got in past few days
                        with their deadlines included. Keep an eye on them not
                        to miss your lessons!
                      </p>
                    </li>
                    <li>
                      <h1 className="text-lg font-semibold mb-2">
                        4. Home page
                      </h1>
                      <p className="text-dark/80">
                        On the home page you can find quick access to all of
                        your courses and a chart that illustrates how many tasks
                        you have done in courses.
                      </p>
                    </li>
                  </ul>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-row gap-4 justify-between mt-7">
              <div className="w-[1000px] h-[500px]">
                <DataTable columns={columns} data={courses} />
              </div>
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
                    {[...(requests as UrgentTask[])]
                      .reverse()
                      .slice(0, 2)
                      .map((request) => (
                        <Link href={`/platform/myCourses`} key={request.id}>
                          <Card>
                            <CardContent className="p-4 h-full">
                              <CardDescription className="h-full flex flex-row gap-4 items-center">
                                <div className="h-full flex items-start justify-center">
                                  <span className="w-[40px] h-[40px] bg-dark rounded-full flex items-center justify-center">
                                    <CalendarClock
                                      size={20}
                                      className="text-background-light"
                                    />
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h1 className="text-sm font-semibold">
                                    Urgent task in {request.courseName}
                                  </h1>
                                  <h2>You have a urgent task.</h2>

                                  <div className="flex flex-row gap-1 items-center">
                                    <CalendarDays size={16} />
                                    Deadline: {request.deadline}
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
            <div className="absolute right-0 bottom-0">
              <Image
                src="/yellow-kid-learning-img.svg"
                width={420}
                height={420}
                alt="Picture of the author"
              />
            </div>
          </div>
        )}
      </div>
    )
  );
}
