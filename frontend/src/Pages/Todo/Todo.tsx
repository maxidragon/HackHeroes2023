import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { Todo as TodoInterface } from "../../lib/interfaces";
import TodoCard from "./Components/TodoCard";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const isPresent = useIsPresent();
  const navigate = useNavigate();
  const todoRef: any = useRef();

  const [todos, setTodos] = useState<TodoInterface[]>();

  const getMyTodos = useCallback(async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 401) return navigate("/login");
    const data = await response.json();
    setTodos(data);
  }, [navigate]);

  useEffect(() => {
    getMyTodos();
  }, [getMyTodos]);

  const createTodo = async () => {
    if (!todoRef.current.value || todoRef.current.value === "") return toast.error(t('todoEmpty'));
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ text: todoRef.current.value }),
    });
    if (response.status === 201) {
      await getMyTodos();
      todoRef.current.value = "";
      toast.success(t('todoSuccess'));
    }
    return 0;
  };
  return (
    <>
      <div className="flex-1 mt-3">
        <div className="flex flex-col flex-wrap justify-center gap-4 ml-3">
          <div className="flex">
            <Input type="text" placeholder={t('todoText')} ref={todoRef} />
          </div>
          <div className="flex">
            <Button type="default" onClick={createTodo}>{t('todoCreate')}</Button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-4 mt-5">
          {todos && todos.length ? "" : <p className="text-2xl text-white py-4">{t('todo.notTodos')}</p>}
          {todos && todos.map((todo: TodoInterface) => (
            <TodoCard key={todo.id} todo={todo} fetchTodos={getMyTodos} />
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

    </>
  );
}