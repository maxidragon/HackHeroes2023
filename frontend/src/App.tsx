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
          path: "/notes",
          element: <Notes />
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
              path: "/class-register/attendence",
              element: <div>Attendence</div>
            },
            {
              path: "/class-register/homework",
              element: <div>Homework</div>
            },
            {
              path: "/class-register/exams",
              element: <div>Exams</div>
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
