import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getFlashcards from "../../lib/flashcards/getFlashcards.ts";
import Input from "../../Components/Input.tsx";
import Button from "../../Components/Button.tsx";

interface flashcard {
  id: number,
  title: string,
  description: string,
}

export default function Flashcards() {
  const isPresent = useIsPresent();
  const [myFlashcards, setMyFlashcards] = useState([]);
  const [classFlashcards, setClassFlashcards] = useState([]);
  const [publicFlashcards, setPublicFlashcards] = useState([]);

  useEffect(() => {

    getFlashcards("my").then(data => {
      setMyFlashcards(data);
    });

    getFlashcards("class").then(data => {
      setClassFlashcards(data);
    });

    getFlashcards("public").then(data => {
      setPublicFlashcards(data);
    });

  }, []);

  return (
    <div className="flex w-[80%] mx-auto max-w-[1300px] flex-col items-center gap-5 py-6">

      <fieldset
        className="flex flex-col md:flex-row border-gray-500 border-2 p-6 justify-between items-center w-full gap-6">
        <legend className="text-xl text-white px-2">{t("flashcardsLegend")}</legend>
        <Input placeholder={t("searchPlaceholder")} className="w-full text-xl" containerClassName="w-full" />
        <div className="flex gap-6">
          <Button type="default" className="text-xl py-4" width="w-70">{t("searchPlaceholder")}</Button>
          <Button type="alt" isLink={true} to="/flashcards/create"
                  className="py-4 text-xl">{t("createNewFlashCardSet")}</Button>
        </div>
      </fieldset>

      {myFlashcards.length ? <div className="w-full py-6">
        <h2 className="py-4 text-2xl">{t("personalSets")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
          {myFlashcards.map((flashcard: flashcard) => {
            return (
              <Link className="shadow-lg px-3 py-6 text-white bg-violet-700 hover:bg-violet-800 transition rounded-xl"
                    key={flashcard.id}
                    to={`/flashcards/details/${flashcard.id}`}>
                <h3 className="text-xl">{flashcard.title}</h3>
              </Link>
            );
          })}
        </div>
      </div> : ""}

      {classFlashcards.length ? <div className="w-full py-6">
        <h2 className="py-4 text-2xl">{t("classSets")}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
          {classFlashcards.map((flashcard: flashcard) => {
            return (
              <Link className="shadow-lg px-3 py-5 text-white bg-violet-700 hover:bg-violet-800 transition rounded-xl"
                    key={flashcard.id}
                    to={`/flashcards/details/${flashcard.id}`}>
                <h3 className="text-xl">{flashcard.title}</h3>
              </Link>
            );
          })}
        </div>
      </div> : ""}

      {publicFlashcards.length ?
        <div className="w-full py-6">
          <h2 className="py-4 text-2xl">{t("publicSets")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
            {publicFlashcards.map((flashcard: flashcard) => {
              return (
                <Link className="shadow-lg px-3 py-5 text-white bg-violet-700 hover:bg-violet-800 transition rounded-xl"
                      key={flashcard.id}
                      to={`/flashcards/details/${flashcard.id}`}>
                  <h3 className="text-xl">{flashcard.title}</h3>
                </Link>
              );
            })}
          </div>
        </div> : ""}

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
