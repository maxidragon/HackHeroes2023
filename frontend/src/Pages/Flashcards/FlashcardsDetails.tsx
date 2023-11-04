import { motion, useIsPresent } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.tsx";
import getFlashcardSet from "../../lib/flashcards/getFlashcardSet.ts";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { pl, enUS } from "date-fns/locale";
import { t } from "i18next";
import i18n from "../../lib/i18n.ts";
import getUserObject from "../../lib/getUser.ts";
import toast from "react-hot-toast";
import {
  BsFillTrashFill,
  BsFillPencilFill,
  BsFillPlayFill,
} from "react-icons/bs";
import Loader from "../../Components/Loader.tsx";
import { FlashcardSet, PublicUser } from "../../lib/interfaces.ts";


export default function FlashcardsDetails() {
  const isPresent = useIsPresent();
  const [flashCardSet, setFlashcardSet] = useState<FlashcardSet>({
    createdAt: "",
    description: "",
    flashCards: [],
    forkedFrom: "",
    id: 0,
    publicity: "",
    title: "",
    updatedAt: "",
    user: {
      username: "",
      id: 0,
    },
  });

  const { id } = useParams();
  const loggedUser: PublicUser = getUserObject();
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  const deleteSet = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/flashcard/set/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return toast.error(t("somethingWentWrong"));
    }

    toast.success(t("flashcardDeleted"));
    setTimeout(() => {
      return navigate("/flashcards");
    }, 750);
  };

  const forkSet = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/flashcard/set/${id}/fork`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return toast.error(t("somethingWentWrong"));
    }

    toast.success(t("flashcardForked"));
    setTimeout(() => {
      return navigate("/flashcards");
    }, 750);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsFetching(true);
        const data = await getFlashcardSet(id);
        setFlashcardSet(data);
        setIsFetching(false);
      };
      fetchData();
    }
  }, [id]);

  return (
    <div className="flex-1 text-white py-6 w-[80%] max-w-[1300px] mx-auto">
      {isFetching ? (
        <div className="flex items-center justify-center">
          <Loader width="200" />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center w-full">
            <h2 className="text-3xl">{flashCardSet.title}</h2>
            <div className="flex gap-3">
              {loggedUser.id === flashCardSet.user?.id && (
                <Button
                  className="text-lg px-4 py-2 mt-8 disabled:bg-gray-400 disabled:text-gray-400"
                  width="w-42"
                  type="alt"
                  onClick={deleteSet}
                >
                  <BsFillTrashFill />
                </Button>
              )}
              {loggedUser.id === flashCardSet.user?.id && (
                <Button
                  isLink={true}
                  to={`/flashcards/edit/${id}`}
                  className="text-lg px-4 py-2 mt-8"
                  width="w-42"
                  type="alt"
                >
                  <BsFillPencilFill />
                </Button>
              )}
              {loggedUser.id !== flashCardSet.user?.id && (
                <Button
                  className="text-lg px-4 py-2 mt-8"
                  width="w-42"
                  type="alt"
                  onClick={forkSet}
                >
                  {t('copy')}
                </Button>
              )}
              <Button
                isLink={true}
                to={`/flashcards/learn/${id}`}
                className="text-lg px-4 py-2 mt-8"
                width="w-42"
                type="default"
              >
                {t("startLearning")} <BsFillPlayFill />
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:mt-0 mt-8 gap-1">
            <p>
              {t("author")}:{" "}
              <Link to={`/profile/${flashCardSet.user?.id}`}>{flashCardSet.user?.username}</Link>
            </p>
            {flashCardSet.forkedFrom && (
              <p>
                {t("forkedFrom")}: {flashCardSet.forkedFrom}
              </p>
            )}
            <p>
              {t("createdAt")}:{" "}
              {formatDistanceToNow(
                flashCardSet.createdAt ? new Date(flashCardSet.createdAt) : new Date(),
                {
                  addSuffix: true,
                  locale: i18n.language === "pl" ? pl : enUS,
                }
              )}
            </p>
            <p>
              {t("lastModified")}:{" "}
              {formatDistanceToNow(
                flashCardSet.updatedAt ? new Date(flashCardSet.updatedAt) : new Date(),
                {
                  addSuffix: true,
                  locale: i18n.language === "pl" ? pl : enUS,
                }
              )}
            </p>
            <p>
              {t("description")}: {flashCardSet.description}
            </p>
            <p className="text-gray-400">
              {t("publicity")}: {t(flashCardSet.publicity.toLowerCase())}
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <p>{t("questionsAndAnswers")}:</p>
            <div className="flex flex-wrap gap-8 md:justify-start justify-around">
              {flashCardSet.flashCards.map((flashCard, i: number) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, bottom: "-5px" }}
                    animate={{
                      opacity: 1,
                      bottom: 0,
                      transition: { duration: 0.2, delay: i * 0.05 },
                    }}
                    key={flashCard.id}
                    className="flex flex-col p-4 bg-purple-600 rounded-xl text-lg w-48"
                  >
                    <p className="text-ellipsis overflow-hidden">
                      {t("question") + ": "}
                      {flashCard.question}
                    </p>
                    <p className="text-ellipsis overflow-hidden text-gray-300">
                      {t("answer") + ": "}
                      {flashCard.answer}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
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
