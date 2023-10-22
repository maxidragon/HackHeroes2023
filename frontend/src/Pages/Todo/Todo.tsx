import { useEffect, useState } from "react";
import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { Todo as TodoInterface } from "../../lib/interfaces";
import TodoCard from "./Components/TodoCard";

export default function Todo() {
  const isPresent = useIsPresent();

  const [todos, setTodos] = useState<TodoInterface[]>([]);

  const getMyTodos = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    getMyTodos();
  }, []);
  return (
    <div className="flex-1">
      <h1>{t('todoTitle')}</h1>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {todos.length ? "" : <p className="text-2xl text-white py-4">{t('todo.notTodos')}</p>}
        {todos.map((todo: TodoInterface) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{
          scaleX: 0,
          transition: { duration: 0.6, ease: "circOut" },
        }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}