import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { Todo as TodoInterface } from "../../lib/interfaces";
import TodoCard from "./Components/TodoCard";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { userAtom } from "../../Atoms";
import { useAtomValue } from "jotai";

export default function Todo() {
  const isPresent = useIsPresent();
  const navigate = useNavigate();
  const todoRef: any = useRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMoreTodosButton, setShowMoreTodosButton] = useState<boolean>(true);
  const [todos, setTodos] = useState<TodoInterface[]>();
  const [search, setSearch] = useState<string>("");
  const [loadOnlyDone, setLoadOnlyDone] = useState<boolean>(false);
  const user = useAtomValue(userAtom);

  const getMyTodos = useCallback(
    async (skip = 0, take = 10, isDone = false, searchParam?: string) => {
      setIsLoading(true);
      setLoadOnlyDone(isDone);
      let url = `${
        import.meta.env.VITE_API_URL
      }/todo?skip=${skip}&take=${take}&done=${isDone}`;
      if (searchParam && searchParam !== "") {
        url += `&search=${searchParam}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 401) return navigate("/login");
      const data = await response.json();
      setTodos(data.todos);
      if (
        data.todos.length < 10 ||
        data.todos.length === 0 ||
        data.todos.length === data.count
      )
        setShowMoreTodosButton(false);
      if (data.todos.length < data.count) setShowMoreTodosButton(true);
      setIsLoading(false);
    },
    [navigate, setTodos, setIsLoading, setShowMoreTodosButton, setLoadOnlyDone]
  );

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
    } else {
      getMyTodos();
    }
  }, [getMyTodos, user, navigate]);

  const createTodo = async () => {
    if (!todoRef.current.value || todoRef.current.value === "")
      return toast.error(t("todoEmpty"));
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
      toast.success(t("todoSuccess"));
    }
    return 0;
  };

  const getMoreTodos = async () => {
    setIsLoading(true);
    setShowMoreTodosButton(false);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/todo?skip=${todos?.length}&take=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status === 401) return navigate("/login");
    const data = await response.json();
    setTodos([...todos!, ...data.todos]);
    if (data.todos.length < 10 || data.todos.length === 0)
      setShowMoreTodosButton(false);
    if (todos && todos.length + data.todos.length === data.count)
      setShowMoreTodosButton(false);
    if (todos && todos.length + data.todos.length < data.count)
      setShowMoreTodosButton(true);
    setIsLoading(false);
  };

  const handleSearch = async (event: any) => {
    setSearch(event.target.value);
    await getMyTodos(0, 10, loadOnlyDone, event.target.value);
  };

  return (
    <div className="flex-1 py-10 flex flex-col items-center gap-4">
      <div className="flex justify-center sm:flex-row flex-col gap-8 lg:w-4/5 w-full px-4">
        <div className="flex flex-col gap-4 lg:w-1/3 w-full">
          <Input
            placeholder={t("searchTodo")}
            onChange={handleSearch}
            value={search}
            className="w-96"
          />
          <div className="flex 2xl:flex-row flex-col gap-4">
            <Button
              type={loadOnlyDone ? "default" : "alt"}
              className="!w-full"
              onClick={() => getMyTodos(0, 10, false)}
            >
              {t("loadUndone")}
            </Button>
            <Button
              type={loadOnlyDone ? "alt" : "default"}
              className="!w-full"
              onClick={() => getMyTodos(0, 10, true)}
            >
              {t("loadDone")}
            </Button>
          </div>
        </div>
        <div className="lg:block hidden w-1 h-full bg-gray-500 rounded-full" />
        <div className="flex flex-col  gap-4 lg:w-1/3 w-full">
          <Input type="text" placeholder={t("todoText")} ref={todoRef} />
          <Button type="default" className="!w-full" onClick={createTodo}>
            {t("todoCreate")}
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-5 lg:w-4/5 w-full px-4">
        <Suspense fallback={<Loader width="200" />}>
          {todos && todos.length ? (
            todos.map((todo: TodoInterface) => (
              <TodoCard key={todo.id} todo={todo} fetchTodos={() => getMyTodos(0, 10, loadOnlyDone)} />
            ))
          ) : (
            <p className="text-4xl text-white roboto text-center">No todos found!</p>
          )}
        </Suspense>
        {isLoading && <Loader width="200" />}
      </div>
      {showMoreTodosButton && (
        <Button type="default" onClick={getMoreTodos}>
          {t("loadMore")}
        </Button>
      )}
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
