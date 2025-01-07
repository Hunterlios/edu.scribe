const API_BASE_URL = "http://localhost:8080/api/v1";

export async function LoginUser(email: any, password: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function RegisterUser(
  firstName: string,
  lastName: string,
  email: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/requestRegistration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email }),
    });

    if (!response.ok) {
      throw new Error("Could not register user");
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export async function RegisterRequests(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch requests");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function RegisterNewTeacher(token: string, id: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/registerNewTeacher/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Could not register teacher");
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export async function RegisterNewStudent(token: string, id: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/registerNewStudent/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Could not register student");
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export async function DeclineRegisterRequest(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/decline/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not decline user registration");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function GetAllStudentsWithCourses(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch students");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function GetCurrentUser(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/current`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch user");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function UpdateUserProfile(
  token: string,
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  profilePictureVersion: number
) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        profilePictureVersion,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not update user");
    }
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
}

export async function ChangePassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/changePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not change password");
    }
  } catch (error) {
    console.error("Password change failed:", error);
    throw error;
  }
}

export async function MyInvitationsTeacher(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/invitations/myInvitationsTeacher`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Could not fetch invitation requests");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function MyCoursesTeacher(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/myCoursesTeacher`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch courses");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function CourseById(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch course");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function CourseParticipants(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/participants/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch participants");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function RemoveCourseParticipant(
  token: string,
  id: number,
  courseId: number
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/courses/removeUser/${courseId}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not remove user");
    }
  } catch (error) {
    console.error("User remove failed:", error);
    throw error;
  }
}

export async function TasksFromCourse(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/course/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch tasks");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function UnsolvedTasksTeacher(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resources/myUnsolvedTasksTeacher`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Could not fetch tasks");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function LateSolvedTasksTeacher(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resources/myLateTasksTeacher`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Could not fetch tasks");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function AllFromTaskTeacher(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/fromTask/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch all from task");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function AllResourcesFromCourse(token: string, id: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/courses/resources/fromCourse/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Could not fetch all from course");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function Download(token: string, downloadLink: string) {
  try {
    const response = await fetch(`http://localhost:8080${downloadLink}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not dowload file");
    }
    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function Upload(token: string, formData: FormData, id: number) {
  console.log(formData);
  try {
    const response = await fetch(
      `${API_BASE_URL}/courses/resources/upload/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Could not upload file");
    }
    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function UpdateTask(
  token: string,
  id: number,
  content: string,
  deadline: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        deadline,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not update task");
    }
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
}

export async function RemoveTask(token: string, taskId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could not remove task");
    }
  } catch (error) {
    console.error("Task remove failed:", error);
    throw error;
  }
}

export async function AddTask(
  token: string,
  courseId: number,
  deadline: string,
  contents: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/createTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        deadline,
        contents,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not add task");
    }
  } catch (error) {
    console.error("Task add failed:", error);
    throw error;
  }
}

export async function RemoveCourseResource(token: string, downloadURL: string) {
  try {
    downloadURL = downloadURL.replace(
      "/api/v1/courses/resources/download/",
      ""
    );
    const response = await fetch(
      `${API_BASE_URL}/courses/resources/${downloadURL}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not remove resource");
    }
  } catch (error) {
    console.error("Resource remove failed:", error);
    throw error;
  }
}

export async function AddCourse(
  token: string,
  name: number,
  zoomLink: string,
  zoomPasscode: string,
  date: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        zoomLink,
        zoomPasscode,
        date,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not add course");
    }
  } catch (error) {
    console.error("Course add failed:", error);
    throw error;
  }
}

export async function AddUserToCourse(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/invitations/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not add user to course");
    }
  } catch (error) {
    console.error("Add user to course failed:", error);
    throw error;
  }
}

export async function DeclineAddUserToCourse(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/invitations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not decline user");
    }
    return response.json();
  } catch (error) {
    console.error("Decline failed:", error);
    throw error;
  }
}

export async function GetAllCourses(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch courses");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function RemoveCourse(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could not remove course");
    }
  } catch (error) {
    console.error("Course remove failed:", error);
    throw error;
  }
}

export async function JoinCourse(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/invitations/join/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not send join request to course");
    }
  } catch (error) {
    console.error("Join request to course failed:", error);
    throw error;
  }
}

export async function UpdateCourse(
  token: string,
  id: number,
  name: number,
  zoomLink: string,
  zoomPasscode: string,
  date: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        zoomLink,
        zoomPasscode,
        date,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not update course");
    }
  } catch (error) {
    console.error("Course update failed:", error);
    throw error;
  }
}

export async function QuizesFromCourse(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/quizes/course/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch quizzes");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

export async function RemoveQuiz(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/quizes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could not remove quiz");
    }
  } catch (error) {
    console.error("Quiz remove failed:", error);
    throw error;
  }
}

export async function UpdateQuiz(token: string, id: number, name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/quizes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not update quiz");
    }
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
}

export async function AddQuiz(token: string, courseId: number, name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/quizes/createQuiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not add quiz");
    }
  } catch (error) {
    console.error("Quiz add failed:", error);
    throw error;
  }
}
