import { motion, useIsPresent } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Flashcards() {
  const isPresent = useIsPresent();
  const [myFlashcards, setMyFlashcards] = useState([]);

  const getMyFlashcards = async () => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (!response.ok) return [];

    return await response.json();
  };

  useEffect(() => {

    getMyFlashcards().then(data => {
      setMyFlashcards(data);
    });

  }, []);

  return (
    <div className="flex-1">
      <div className="mx-auto text-center py-10">
        {myFlashcards.length ? "" : <p className="text-2xl text-white py-4">You do not have any flashcards!</p>}
        <Link to="/flashcards/create" className="hover:text-purple-500 transition">Create new flashcard set</Link>
        {myFlashcards.map(flashcard => {
          return (
            <Link to={`/flashcards/${flashcard.id}`}>
              <h3>{flashcard.title}</h3>
            </Link>
          );
        })}
      </div>
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
