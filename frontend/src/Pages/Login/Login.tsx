import { Link, useNavigate } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../Atoms";
import getUserObject from "../../lib/getUser";
import { TbArrowLeft } from "react-icons/tb";

export default function Login() {
  const isPresent = useIsPresent();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);

  const login = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRef.current?.value || !passwordRef.current?.value) {
      toast.error("Fill all the fields!");
      return;
    } else if (!emailRegex.test(emailRef.current?.value)) {
      toast.error("Invalid email!");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400) {
          toast.error("Wrong email or password!");
          return;
        } else {
          toast.success("Logged in successfully!");
          setUser(() => getUserObject());
          setTimeout(() => {
            navigate("/");
          }, 750);
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
        <Link className="absolute top-4 left-4 text-gray-400 flex items-center gap-2 hover:text-white transition-all" to="/">
          <TbArrowLeft />
          Back to home
        </Link>
        <h1 className="text-7xl mb-16 roboto">Login</h1>
        <Input placeholder="E-Mail" ref={emailRef} type="email" />
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
