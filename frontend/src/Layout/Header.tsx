import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../graphics/logo.svg";
import Button from "../Components/Button";

export default function Header() {
  return (
    <>
      <header className="w-screen border-b-2 border-purple-400 h-auto flex justify-between items-center px-8 py-2">
        <Link to="/" className="flex items-center w-fit">
          <img src={logo} alt="Study_sphere_logo" className="w-16" />
          <h1 className="roboto text-3xl">Study Sphere</h1>
        </Link>
        <nav className="roboto uppercase flex items-center gap-8 text-2xl h-8">
          <NavLink
            className={({ isActive }) => {
              return isActive ? "text-purple-400" : "text-white";
            }}
            to="/notes"
          >
            Notes
          </NavLink>
          <div className="w-0.5 rounded-xl h-full bg-purple-400" />
          <NavLink
            to="/class-register"
            className={({ isActive }) => {
              return isActive ? "text-purple-400" : "text-white";
            }}
          >
            Class register
          </NavLink>
          <div className="w-0.5 rounded-xl h-full bg-purple-400" />
          <NavLink
            to="/todo"
            className={({ isActive }) => {
              return isActive ? "text-purple-400" : "text-white";
            }}
          >
            Todo
          </NavLink>
        </nav>
        <Button
          type="default"
          isLink
          to="/login"
          className="roboto text-center"
          width="w-48"
        >
          Login
        </Button>
      </header>
      <Outlet />
    </>
  );
}
