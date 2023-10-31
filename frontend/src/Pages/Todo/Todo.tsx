import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { Todo as TodoInterface } from "../../lib/interfaces";
import TodoCard from "./Components/TodoCard";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { AiFillPlusCircle } from "react-icons/ai";

export default function Todo() {
  const isPresent = useIsPresent();
  const navigate = useNavigate();
  const todoRef: any = useRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMoreTodosButton, setShowMoreTodosButton] = useState<boolean>(true);
  const [todos, setTodos] = useState<TodoInterface[]>();
  const [search, setSearch] = useState<string>("");
  const [loadOnlyDone, setLoadOnlyDone] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const getMyTodos = useCallback(async (skip = 0, take = 10, isDone = false, searchParam?: string) => {
    setIsLoading(true);
    setLoadOnlyDone(isDone);
    let url = `${import.meta.env.VITE_API_URL}/todo?skip=${skip}&take=${take}&done=${isDone}`;
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
    if (data.todos.length < 10 || data.todos.length === 0 || data.todos.length === data.count) setShowMoreTodosButton(false);
    if (data.todos.length < data.count) setShowMoreTodosButton(true);
    setIsLoading(false);
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
      setOpenCreate(false);
    }
    return 0;
  };

  const getMoreTodos = async () => {
    setIsLoading(true);
    setShowMoreTodosButton(false);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todo?skip=${todos?.length}&take=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 401) return navigate("/login");
    const data = await response.json();
    setTodos([...todos!, ...data.todos]);
    if (data.todos.length < 10 || data.todos.length === 0) setShowMoreTodosButton(false);
    if (todos && todos.length + data.todos.length === data.count) setShowMoreTodosButton(false);
    if (todos && todos.length + data.todos.length < data.count) setShowMoreTodosButton(true);
    setIsLoading(false);
  };

  const handleSearch = async (event: any) => {
    setSearch(event.target.value);
    await getMyTodos(0, 10, loadOnlyDone, event.target.value);
  };
  return (
    <>
      <div className="flex-1 mt-3">
        <div className="flex flex-col flex-wrap justify-center gap-4 ml-3">
          {!openCreate && (
            <>
              <div className="flex flex-row flex-wrap gap-4 justify-center">
                <Input
                  type="text"
                  placeholder={t('searchTodo')}
                  onChange={handleSearch}
                  value={search}
                  className="w-96"
                />
              </div>
              <div className="flex flex-row flex-wrap gap-4 justify-center">
                <Button type={loadOnlyDone ? "default" : "alt"} onClick={() => getMyTodos(0, 10, false)}>{t('loadUndone')}</Button>
                <Button type={loadOnlyDone ? "alt" : "default"} onClick={() => getMyTodos(0, 10, true)}>{t('loadDone')}</Button>
              </div>
              <div className="flex flex-row flex-wrap justify-center gap-4">
                <Button type="default" onClick={() => setOpenCreate(!openCreate)} width="5"><AiFillPlusCircle /></Button>
              </div>
            </>
          )}
          <div className="flex flex-row flex-wrap justify-center gap-4">
            {openCreate && (
              <div className="flex flex-col flex-wrap justify-center gap-4">
                <Input
                  type="text"
                  placeholder={t('todoText')}
                  ref={todoRef}
                />
                <Button type="default" onClick={createTodo}>{t('todoCreate')}</Button>
                <Button type="default" onClick={() => setOpenCreate(false)}>{t('cancel')}</Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-4 mt-5">
          {todos && todos.length ? "" : <p className="text-2xl text-white py-4">{t('notTodos')}</p>}
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-4 mt-5">
          {todos && todos.map((todo: TodoInterface) => (
            <TodoCard key={todo.id} todo={todo} fetchTodos={getMyTodos} />
          ))}
          {isLoading && <Loader width="200" />}
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-4 mt-5">
          {showMoreTodosButton && <Button type="default" onClick={getMoreTodos}>{t('loadMore')}</Button>}
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