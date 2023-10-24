import { motion, useIsPresent } from "framer-motion";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Atoms";
import NoVulcan from "./Pages/NoVulcan";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FancyNavbar from "./Components/FancyNavbar";

export default function ClassRegister() {
  const isPresent = useIsPresent();
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="flex-1">
      {user.isVulcanEnabled ? (
        <>
          <FancyNavbar />
          <Outlet />
        </>
      ) : (
        <NoVulcan />
      )}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{
          scaleX: 0,
          transition: { duration: 0.6, ease: "circOut" },
        }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}
