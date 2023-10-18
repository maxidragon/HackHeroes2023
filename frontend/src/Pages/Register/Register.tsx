import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";

export default function Register() {
  const isPresent = useIsPresent();

  return (
    <div>
      <h1>Register</h1>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.6, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen bg-purple-400 z-50"
      />
    </div>
  );
}
