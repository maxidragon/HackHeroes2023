import { t } from "i18next";
import toast from "react-hot-toast";
import Button from "../../../Components/Button";
import { Todo } from "../../../lib/interfaces";
import { MdDone, MdDelete } from "react-icons/md";
const TodoCard = ({ todo, fetchTodos }: {
    todo: Todo;
    fetchTodos: () => void;
}) => {
    let classes = "text-white font-semibold";
    if (todo.done) {
        classes += " line-through";
    }

    const markAsDone = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/todo/complete/${todo.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.status === 200) {
            toast.success(t('todoMarked'));
            await fetchTodos();
        } else if (response.status === 403) {
            toast.error(t('errorForbidden'));
        }
    };

    const deleteTodo = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/todo/${todo.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.status === 200) {
            toast.success(t('todoDeleted'));
            await fetchTodos();
        } else if (response.status === 403) {
            toast.error(t('errorForbidden'));
        }
    }
    return (
        <div className="rounded-lg shadow-md p-4 relative bg-purple-600 w-64 h-20">
            <p className={classes}>{todo.text}</p>
            <div className="absolute bottom-0 right-0 flex flex-row">
                <Button type="default" onClick={markAsDone} width="20">
                    <MdDone size={25} />
                </Button>
                <Button type="default" onClick={deleteTodo} width="20">
                    <MdDelete size={25} />
                </Button>
            </div>
        </div>
    );
}

export default TodoCard;
