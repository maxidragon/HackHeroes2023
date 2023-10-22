import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../graphics/logo.svg";
import { useAtomValue } from "jotai";
import { userAtom } from "../Atoms";
import toast from "react-hot-toast";
import Nav from "./Components/Nav";

export default function Header() {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  function logout() {
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      toast.success("Logged out successfully!");
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 750);
    });
  }

  return (
    <>
      <header className="w-screen border-b-2 border-purple-400 flex justify-between items-center px-8 py-2 overflow-y-hidden">
        <Link to="/" className="flex items-center w-fit">
          <img src={logo} alt="Study_sphere_logo" className="w-16" />
          <h1 className="roboto text-3xl">EduSphere</h1>
        </Link>
        <Nav user={user} logout={logout} />
      </header>
      <Outlet />
    </>
  );
}
