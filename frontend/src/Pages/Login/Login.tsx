import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";

export default function Login() {
  const isPresent = useIsPresent();

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
        <h1 className="text-7xl mb-16">Login</h1>
        <Input placeholder="Username" />
        <Input
          placeholder="Password"
          type="password"
        />
        <Button type="default">
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
