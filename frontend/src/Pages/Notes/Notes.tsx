import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import Button from "../../Components/Button";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Atoms";

export default function Notes() {
  const isPresent = useIsPresent();
  const user = useAtomValue(userAtom);

  return (
    <div className="flex-1 relative flex flex-col items-center gap-4">
      <Button type="alt" isLink={true} to={user.id ? "/notes/add" : "/login"} className="absolute top-2 left-4 mt-4 !test-lg !w-48">
        Dodaj notatkę
      </Button>
      <h1 className="text-center text-4xl roboto text-white mt-4">
        {t("notesTitle")}
      </h1>
      <p>Tutaj szukajkę walnij byku</p>
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
