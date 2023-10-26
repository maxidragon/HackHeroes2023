import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface flashcard {
  id: number,
  title: string,
  description: string,
}

export default function Flashcards() {
  const isPresent = useIsPresent();
  const [myFlashcards, setMyFlashcards] = useState([]);
  const [classFlashcards, setClassFlashcards] = useState([]);


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

  const getClassFlashcards = async () => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/class`, {
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

    getClassFlashcards().then(data => {
      setClassFlashcards(data);
    });

  }, []);

  return (
    <div className="flex w-[80%] mx-auto max-w-[1300px] flex-col items-center gap-5 py-6">
      <Link to="/flashcards/create" className="py-4 hover:text-purple-500 transition text-xl">{t('createNewFlashCardSet')}</Link>
      <div className="w-full py-6">
        <h2 className="py-4 text-2xl">{t('personalSets')}</h2>
        {myFlashcards.length ? "" : <p className="text-2xl text-red-400 py-4">{t('notFlashCards')}</p>}
        <div className="grid grid-cols-4 gap-4 w-full">
          {myFlashcards.map((flashcard: flashcard) => {
            return (
              <Link className="px-4 py-2 text-white bg-violet-950 border-purple-300 border-2 rounded-lg"
                key={flashcard.id}
                to={`/flashcards/details/${flashcard.id}`}>
                <h3>{flashcard.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="w-full py-6">
        <h2 className="py-4 text-2xl">{t('classSets')}</h2>
        {classFlashcards.length ? "" :
          <p className="text-xl text-red-400 py-4">{t('notFlashCards')}</p>}
        <div className="grid grid-cols-4 gap-4 w-full">
          {classFlashcards.map((flashcard: flashcard) => {
            return (
              <Link className="px-4 py-2 text-white bg-violet-950 border-purple-300 border-2 rounded-lg"
                key={flashcard.id}
                to={`/flashcards/details/${flashcard.id}`}>
                <h3>{flashcard.title}</h3>
              </Link>
            );
          })}
        </div>
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
