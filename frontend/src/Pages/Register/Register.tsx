import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";

export default function Register() {
  const isPresent = useIsPresent();

  return (
    <div className="w-screen h-screen flex">
      <div className="xl:w-1/3 lg:w-1/2 w-screen flex flex-col items-center justify-center gap-6 relative">
        <Link className="absolute top-4 left-4" to="/">
          Back to home
        </Link>
        <h1 className="text-7xl mb-16 roboto">Register</h1>
        <Input placeholder="Username" />
        <Input placeholder="E-Mail" type="email" />
        <Input
          placeholder="Password"
          type="password"
        />
        <Input
          placeholder="Repeat Password"
          type="password"
        />
        <Button type="default">
          REGISTER
        </Button>
        <Link to="/login">Already have an account? Login</Link>
      </div>
      <img
        src={background}
        className="xl:w-2/3 lg:w-1/2 hidden lg:block h-screen"
        alt=""
      />
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
