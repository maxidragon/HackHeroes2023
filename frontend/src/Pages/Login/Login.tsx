import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";

export default function Login() {
    const isPresent = useIsPresent();

    return (
      <div>
        <h1>Login</h1>
        <Link to="/">home</Link>
        <Link to="/register">Register</Link>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{
            scaleX: 0,
            transition: { duration: 0.6, ease: "circOut" },
          }}
          exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="privacy-screen bg-purple-400 z-50"
        />
      </div>
    );
}