import { t } from "i18next";
import toast from "react-hot-toast";
import { Todo } from "../../../lib/interfaces";
import { MdDone, MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
const TodoCard = ({
  todo,
  fetchTodos,
  index,
}: {
  todo: Todo;
  fetchTodos: () => void;
  index: number;
}) => {
  const markAsDone = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/todo/complete/${todo.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status === 200) {
      toast.success(t("todoMarked"));
      await fetchTodos();
    } else if (response.status === 403) {
      toast.error(t("errorForbidden"));
    }
  };

  const deleteTodo = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/todo/${todo.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status === 200) {
      toast.success(t("todoDeleted"));
      await fetchTodos();
    } else if (response.status === 403) {
      toast.error(t("errorForbidden"));
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, bottom: "-5px" }}
      animate={{
        opacity: 1,
        bottom: 0,
        transition: { duration: 0.2, delay: index * 0.1 },
      }}
      className="rounded-lg shadow-md p-4 relative bg-purple-600 md:w-64 w-full h-24"
    >
      <p
        className="text-white font-semibold text-xl text-ellipsis overflow-hidden w-full"
        title={todo.text}
      >
        {todo.text}
      </p>
      {todo.done && <p className="text-sm text-white opacity-80">Completed</p>}
      <div className="absolute flex items-center gap-2 bottom-2 right-2 text-white">
        {!todo.done && (
          <MdDone
            size={25}
            onClick={markAsDone}
            className="cursor-pointer hover:scale-110 hover:text-green-400 transition-all"
          />
        )}
        <MdDelete
          size={25}
          onClick={deleteTodo}
          className="cursor-pointer hover:scale-110 hover:text-red-500 transition-all"
        />
      </div>
    </motion.div>
  );
};

export default TodoCard;
