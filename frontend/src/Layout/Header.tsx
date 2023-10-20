import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../graphics/logo.svg";
import Button from "../Components/Button";
import { useAtomValue } from "jotai";
import { userAtom } from "../Atoms";
import toast from "react-hot-toast";

export default function Header() {
  const user = useAtomValue(userAtom);

  function logout() {
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      toast.success("Logged out successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 750);
    });
  }

  return (
    <>
      <header className="w-screen border-b-2 border-purple-400 h-auto flex justify-between items-center px-8 py-2">
        <Link to="/" className="flex items-center w-fit">
          <img src={logo} alt="Study_sphere_logo" className="w-16" />
          <h1 className="roboto text-3xl">Edu Sphere</h1>
        </Link>
        <nav className="roboto uppercase flex items-center gap-8 text-2xl h-8">
          <NavLink
            className={({ isActive }) => {
              return `rounded-full px-4 link ${
                isActive
                  ? "text-slate-200 !bg-left"
                  : "text-gray-400 bg-bgLght !bg-right"
              }`;
            }}
            to="/flashcards"
          >
            Flash cards
          </NavLink>
          <div className="w-1 rounded-xl h-full bg-bgLght" />
          <NavLink
            className={({ isActive }) => {
              return `rounded-full px-4 link ${
                isActive
                  ? "text-slate-200 !bg-left"
                  : "text-gray-400 bg-bgLght !bg-right"
              }`;
            }}
            to="/notes"
          >
            Notes
          </NavLink>
          <div className="w-1 rounded-xl h-full bg-bgLght" />
          <NavLink
            to="/class-register"
            className={({ isActive }) => {
              return `rounded-full px-4 link ${
                isActive
                  ? "text-slate-200 !bg-left"
                  : "text-gray-400 bg-bgLght !bg-right"
              }`;
            }}
          >
            Class register
          </NavLink>
          <div className="w-1 rounded-xl h-full bg-bgLght" />
          <NavLink
            to="/todo"
            className={({ isActive }) => {
              return `rounded-full px-4 link ${
                isActive
                  ? "text-slate-200 !bg-left"
                  : "text-gray-400 bg-bgLght !bg-right"
              }`;
            }}
          >
            Todo
          </NavLink>
        </nav>
        {user.username ? (
          <div className="flex items-center gap-4 roboto text-3xl">
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center gap-4"
            >
              <div className="rounded-full bg-purple-400 w-8 h-8" />
              {user.username}
            </Link>
            <Button
              type="default"
              className="roboto text-center"
              width="w-28"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            type="default"
            isLink
            to="/login"
            className="roboto text-center"
            width="w-48"
          >
            Login
          </Button>
        )}
      </header>
      <Outlet />
    </>
  );
}
