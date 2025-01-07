"use client";
import {
  LucideIcon,
  Home,
  UserPlus,
  UserCheck,
  List,
  LayoutGrid,
  SquarePlus,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUserContext } from "../currentUserProvider";
import { constructNow } from "date-fns";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const handleLogout = async () => {
  try {
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Could not logout");
    }
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export default function PlatformSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentUser = useCurrentUserContext();

  let navItems: NavItem[] = [];
  if (currentUser?.role === "ADMIN") {
    navItems = [
      { title: "Home", href: "/platform", icon: Home },
      {
        title: "Add teacher",
        href: "/platform/registerTeacher",
        icon: UserPlus,
      },
      { title: "New users", href: "/platform/addUser", icon: UserCheck },
      { title: "Students list", href: "/platform/studentsList", icon: List },
      { title: "All courses", href: "/platform/coursesList", icon: LayoutGrid },
    ];
  } else if (currentUser?.role === "TEACHER") {
    navItems = [
      { title: "Home", href: "/platform", icon: Home },
      { title: "My courses", href: "/platform/myCourses", icon: LayoutGrid },
      { title: "Add course", href: "/platform/addCourse", icon: SquarePlus },
      {
        title: "Courses invitations",
        href: "/platform/coursesInvitations",
        icon: UserCheck,
      },
      { title: "All courses", href: "/platform/coursesList", icon: List },
    ];
  } else if (currentUser?.role === "STUDENT") {
    navItems = [
      { title: "Home", href: "/platform", icon: Home },
      { title: "Courses", href: "/platform/coursesList", icon: List },
    ];
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={false}>
      <Sidebar collapsible="icon">
        {currentUser?.role === "ADMIN" && (
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col justify-around items-center h-[400px]">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      {open ? (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          className="w-[150px] h-[45px] flex justify-center items-center hover:bg-transparent"
                        >
                          <Link href={item.href}>
                            <div className="flex flex-row gap-2 items-center w-full">
                              <span>
                                <item.icon size={20} color="#FAFAFA" />
                              </span>
                              <h1 className="text-white text-sm">
                                {item.title}
                              </h1>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          className="w-[45px] h-[45px] flex justify-center items-center hover:bg-transparent"
                        >
                          <Link
                            href={item.href}
                            className="group-data-[collapsible=icon]:!size-12"
                          >
                            <span>
                              <item.icon size={32} color="#FAFAFA" />
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        )}

        {currentUser?.role === "TEACHER" && (
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col justify-around items-center h-[400px]">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      {open ? (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          className="w-[150px] h-[45px] flex justify-center items-center hover:bg-transparent"
                        >
                          <Link href={item.href}>
                            <div className="flex flex-row gap-2 items-center w-full">
                              <span>
                                <item.icon size={20} color="#FAFAFA" />
                              </span>
                              <h1 className="text-white text-sm">
                                {item.title}
                              </h1>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          className="w-[45px] h-[45px] flex justify-center items-center hover:bg-transparent"
                        >
                          <Link
                            href={item.href}
                            className="group-data-[collapsible=icon]:!size-12"
                          >
                            <span>
                              <item.icon size={32} color="#FAFAFA" />
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        )}

        {currentUser?.role === "STUDENT" && (
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col justify-around items-center h-[400px]">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      {open ? (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          className="w-[150px] h-[45px] flex justify-center items-center hover:bg-transparent"
                        >
                          <Link href={item.href}>
                            <div className="flex flex-row gap-2 items-center w-full">
                              <span>
                                <item.icon size={20} color="#FAFAFA" />
                              </span>
                              <h1 className="text-white text-sm">
                                {item.title}
                              </h1>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          className="w-[45px] h-[45px] flex justify-center items-center hover:bg-transparent"
                        >
                          <Link
                            href={item.href}
                            className="group-data-[collapsible=icon]:!size-12"
                          >
                            <span>
                              <item.icon size={32} color="#FAFAFA" />
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        )}
      </Sidebar>

      <div className="flex flex-col flex-1">
        <header className="flex h-[80px] items-center gap-4 border-b px-6">
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-row gap-5 items-center">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <h1 className="text-base font-semibold underline underline-offset-4">
                {(navItems.find((item) => item.href === pathname)?.title &&
                  navItems.find((item) => item.href === pathname)?.title) ||
                  (pathname === "/platform/profile" && "Profile") ||
                  (pathname === "/platform/changePassword" &&
                    "Change password") ||
                  (pathname === "/platform/courses" && "Course")}
              </h1>
            </div>
            <div className="absolute m-auto left-24 right-0 w-fit">
              <Logo />
            </div>
            <div className="flex flex-row items-center gap-5">
              <div className="flex flex-row gap-2">
                <span className="text-base font-semibold">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
                <Image
                  src={`/${currentUser?.role.toLocaleLowerCase()}-icon.svg`}
                  width={16}
                  height={16}
                  alt=""
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={`/avatar-${currentUser?.profilePictureVersion}.svg`}
                    />
                    <AvatarFallback>
                      {currentUser?.firstName.charAt(0).toLocaleUpperCase()}
                      {currentUser?.lastName.charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link className="cursor-pointer" href={`/platform/profile`}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      className="cursor-pointer"
                      href={`/platform/changePassword`}
                    >
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-semibold cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
