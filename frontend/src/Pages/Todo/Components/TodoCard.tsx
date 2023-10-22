import { Todo } from "../../../lib/interfaces";

const TodoCard = ({ todo }: {
    todo: Todo;
}) => {
    let classes = "text-white font-semibold";
    if (todo.done) {
        classes += " line-through";
    }
    return (
        <div className="rounded-lg shadow-md p-4 relative bg-purple-600 w-64 h-20">
            <p className={classes}>{todo.text}</p>
        </div>
    );
}

export default TodoCard;
