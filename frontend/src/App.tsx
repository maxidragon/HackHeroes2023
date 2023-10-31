import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { cloneElement } from "react";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import ToasterComponent from "./Components/Toaster";
import Header from "./Layout/Header";
import Notes from "./Pages/Notes/Notes";
import Flashcards from "./Pages/Flashcards/Flashcards.tsx";
import ClassRegister from "./Pages/ClassRegister/ClassRegister";
import Todo from "./Pages/Todo/Todo";
import Profile from "./Pages/Profile/Profile";
import Settings from "./Pages/Profile/Settings/Settings";
import CreateFlashcards from "./Pages/Flashcards/CreateFlashcards.tsx";
import Grades from "./Pages/ClassRegister/Pages/Grades.tsx";
import FlashcardsDetails from "./Pages/Flashcards/FlashcardsDetails.tsx";
import Attendance from "./Pages/ClassRegister/Pages/Attendance.tsx";
import Homework from "./Pages/ClassRegister/Pages/Homework.tsx";
import FlashcardsLearn from "./Pages/Flashcards/FlashcardsLearn.tsx";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword.tsx";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.tsx";
import Exams from "./Pages/ClassRegister/Pages/Exams.tsx";
import AddNote from "./Pages/Notes/AddNote.tsx";
import Timetable from "./Pages/ClassRegister/Pages/Timetable.tsx";
import EditNote from "./Pages/Notes/EditNote.tsx";
import EditFlashcards from "./Pages/Flashcards/EditFlashcards.tsx";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/flashcards",
          element: <Flashcards />
        },
        {
          path: "/flashcards/create",
          element: <CreateFlashcards />
        },
        {
          path: "/flashcards/details/:id",
          element: <FlashcardsDetails />
        },
        {
          path: "/flashcards/learn/:id",
          element: <FlashcardsLearn />
        },
        {
          path: "/flashcards/edit/:id",
          element: <EditFlashcards />
        },
        {
          path: "/notes",
          element: <Notes />
        },
        {
          path: "/notes/add",
          element: <AddNote />
        },
        {
          path: "/notes/edit/:id",
          element: <EditNote />
        },
        {
          path: "/class-register",
          element: <ClassRegister />,
          children: [
            {
              path: "/class-register/grades",
              element: <Grades />
            },
            {
              path: "/class-register/attendance",
              element: <Attendance />
            },
            {
              path: "/class-register/homework",
              element: <Homework />
            },
            {
              path: "/class-register/exams",
              element: <Exams />
            },
            {
              path: "/class-register/timetable",
              element: <Timetable />
            }
          ]
        },
        {
          path: "/todo",
          element: <Todo />
        },
        {
          path: "/profile/:userId",
          element: <Profile />
        },
        {
          path: "/settings",
          element: <Settings />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/password/forgot",
      element: <ForgotPassword />
    },
    {
      path: "/password/reset/:hash",
      element: <ResetPassword />
    }
  ]);

  const location = useLocation();

  if (!element) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <ToasterComponent />
      {cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}

export default App;
