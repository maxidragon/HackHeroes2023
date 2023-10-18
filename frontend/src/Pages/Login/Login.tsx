import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useRef } from "react";

export default function Login() {
  const isPresent = useIsPresent();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = () => {
    if (!usernameRef.current?.value || !passwordRef.current?.value) {
      toast.error("Fill all the fields!");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current?.value,
        password: passwordRef.current?.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          toast.error(data.error);
          return;
        } else {
          toast.success("Logged in successfully!");
        }
      })
      .catch((err: any) => {
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  return (
    <div className="w-screen h-screen flex">
      <img
        src={background}
        className="xl:w-2/3 lg:w-1/2 hidden lg:block h-screen"
        alt=""
      />
      <div className="xl:w-1/3 lg:w-1/2 w-screen flex flex-col items-center justify-center gap-6 relative">
        <Link className="absolute top-4 left-4" to="/">
          Back to home
        </Link>
        <h1 className="text-7xl mb-16 roboto">Login</h1>
        <Input placeholder="Username" ref={usernameRef} />
        <Input placeholder="Password" type="password" ref={passwordRef} />
        <Button type="default" onClick={login}>
          LOGIN
        </Button>
        <Link to="/register">Don't have account yet? Register</Link>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{
          scaleX: 0,
          transition: { duration: 0.6, ease: "circOut" },
        }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen bg-indigo-400 z-50"
      />
    </div>
  );
}
