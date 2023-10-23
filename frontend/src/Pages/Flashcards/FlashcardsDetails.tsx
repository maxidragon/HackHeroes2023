import { motion, useIsPresent } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function FlashcardsDetails() {
  const isPresent = useIsPresent();

  const { id } = useParams();

  const getFlashcardSet = async () => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/set/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if(!response.ok) throw Error("Something went wrong!")

    return await response.json()
  };

  useEffect(() => {

    getFlashcardSet().then(data => {
      console.log(data)
    })
  }, [])

  return (
    <div className="flex-1">


      <motion.div
        initial={{ scaleX: 1 }}
        animate={{
          scaleX: 0,
          transition: { duration: 0.6, ease: "circOut" }
        }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}