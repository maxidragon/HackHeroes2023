import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getFlashcards from "../../lib/flashcards/getFlashcards.ts";
import Input from "../../Components/Input.tsx";
import Button from "../../Components/Button.tsx";
import Loader from "../../Components/Loader.tsx";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Atoms.ts";

interface flashcard {
  id: number;
  title: string;
  description: string;
}

export default function Flashcards() {
  const isPresent = useIsPresent();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>();

  const [myFlashcards, setMyFlashcards] = useState([]);
  const [classFlashcards, setClassFlashcards] = useState([]);
  const [publicFlashcards, setPublicFlashcards] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const user = useAtomValue(userAtom);

  const searchHandler = async () => {
    setIsFetching(true);

    await getFlashcards("my", searchRef.current?.value).then((data) => {
      setMyFlashcards(data);
    });

    await getFlashcards("class", searchRef.current?.value).then((data) => {
      setClassFlashcards(data);
    });

    await getFlashcards("public", searchRef.current?.value).then((data) => {
      setPublicFlashcards(data);
    });

    setIsFetching(false);
  };

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
    }

    searchHandler();
  }, [user, navigate]);

  return (
    <div className="flex w-[80%] mx-auto max-w-[1300px] flex-col items-center gap-5 py-6">
      <fieldset className="flex flex-col lg:flex-row border-gray-500 border-t-2 p-6 justify-between items-center w-full gap-6">
        <legend className="text-xl text-white px-2">
          {t("flashcardsLegend")}
        </legend>
        <Input
          ref={searchRef}
          placeholder={t("searchPlaceholder")}
          className="w-full text-xl"
          containerClassName="w-full"
          onChange={searchHandler}
        />
        <div className="flex sm:flex-row flex-col sm:gap-6 gap-2 w-full">
          <Button
            type="default"
            className="text-xl"
            width="w-full"
            onClick={searchHandler}
          >
            {t("searchPlaceholder")}
          </Button>
          <Button
            type="alt"
            isLink={true}
            to="/flashcards/create"
            className="text-xl text-center"
            width="w-full"
          >
            {t("createNewFlashCardSet")}
          </Button>
        </div>
      </fieldset>
      {isFetching ? (
        <Loader width="200" />
      ) : (
        <>
          {myFlashcards.length && (
            <div className="w-full py-6">
              <h2 className="py-4 text-2xl">{t("personalSets")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {myFlashcards.map((flashcard: flashcard) => {
                  return (
                    <Link
                      className="shadow-lg px-3 py-6 text-white bg-violet-700 hover:bg-violet-800 transition rounded-xl"
                      key={flashcard.id}
                      to={`/flashcards/details/${flashcard.id}`}
                    >
                      <h3 className="text-xl">{flashcard.title}</h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {classFlashcards.length > 0 && (
            <div className="w-full py-6">
              <h2 className="py-4 text-2xl">{t("classSets")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {classFlashcards.map((flashcard: flashcard) => {
                  return (
                    <Link
                      className="shadow-lg px-3 py-5 text-white bg-violet-700 hover:bg-violet-800 transition rounded-xl"
                      key={flashcard.id}
                      to={`/flashcards/details/${flashcard.id}`}
                    >
                      <h3 className="text-xl">{flashcard.title}</h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {publicFlashcards.length > 0 && (
            <div className="w-full py-6">
              <h2 className="py-4 text-2xl">{t("publicSets")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                {publicFlashcards.map((flashcard: flashcard) => {
                  return (
                    <Link
                      className="shadow-lg px-3 py-5 text-white bg-violet-700 hover:bg-violet-800 transition rounded-xl"
                      key={flashcard.id}
                      to={`/flashcards/details/${flashcard.id}`}
                    >
                      <h3 className="text-xl">{flashcard.title}</h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      {!publicFlashcards.length &&
        !myFlashcards.length &&
        !classFlashcards.length &&
        !isFetching && (
          <h3 className="text-2xl text-white mt-10">{t("noFlashcards")}</h3>
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
