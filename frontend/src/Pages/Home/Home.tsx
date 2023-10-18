import { motion, useIsPresent } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  const isPresent = useIsPresent();

  return (
    <>
      <h1>Home jajco</h1>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.6, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen bg-purple-400 z-50"
      />
    </>
  );
}
