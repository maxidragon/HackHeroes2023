import { useLocation, useRoutes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { cloneElement } from "react";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import ToasterComponent from "./Components/Toaster";
import Header from "./Layout/Header";
import Notes from "./Pages/Notes/Notes";
import ClassRegister from "./Pages/ClassRegister/ClassRegister";
import Todo from "./Pages/Todo/Todo";
import Flashcards from "./Pages/Flashcards/Flashcards";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/flashcards",
          element: <Flashcards />,
        },
        {
          path: "/notes",
          element: <Notes />,
        },
        {
          path: "/class-register",
          element: <ClassRegister />,
        },
        {
          path: "/todo",
          element: <Todo />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
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
