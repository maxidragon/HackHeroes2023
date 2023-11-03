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

interface user {
  id: number;
  username: string;
}

interface flashCards {
  id: number;
  question: string;
  answer: string;
}

interface flashcardSet {
  title: string;
  description?: string;
  id: number;
  forkedFrom?: string;
  user: user;
  flashCards: flashCards[];
  publicity: string;
  createdAt: string;
  updatedAt: string;
}

export default function FlashcardsDetails() {
  const isPresent = useIsPresent();
  const [
    {
      title,
      user,
      createdAt,
      updatedAt,
      forkedFrom,
      description,
      publicity,
      flashCards,
    },
    setFlashcardSet,
  ] = useState<flashcardSet>({
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
  const loggedUser: user = getUserObject();
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

    const data = await response.json();
    console.log(data);

    toast.success(t("flashcardDeleted"));
    setTimeout(() => {
      return navigate("/flashcards");
    }, 750);
  };

  const setFork = async () => {
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

    const data = await response.json();
    console.log(data);

    toast.success(t("flashcardForked"));
    setTimeout(() => {
      return navigate("/flashcards");
    }, 750);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsFetching(true);
        await getFlashcardSet(id).then((data) => {
          setFlashcardSet(data);
        });
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
          <div className="flex justify-between items-center w-full">
            <h2 className="text-3xl py-4">{title}</h2>
            <div className="flex gap-3">
              {loggedUser.id === user.id && (
                <Button
                  className="text-lg px-4 py-2 mt-8"
                  width="w-42"
                  type="alt"
                  onClick={deleteSet}
                >
                  <BsFillTrashFill />
                </Button>
              )}
              {loggedUser.id === user.id && (
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
              {loggedUser.id !== user.id && (
                <Button
                  className="text-lg px-4 py-2 mt-8"
                  width="w-42"
                  type="alt"
                  onClick={setFork}
                >
                  Save
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
          <p>
            {t("author")}:{" "}
            <Link to={`/profile/${user.id}`}>{user.username}</Link>
          </p>
          {forkedFrom && (
            <p>
              {t("forkedFrom")}: {forkedFrom}
            </p>
          )}
          <p>
            {t("createdAt")}:{" "}
            {formatDistanceToNow(createdAt ? new Date(createdAt) : new Date(), {
              addSuffix: true,
              locale: i18n.language === "pl" ? pl : enUS,
            }) || ""}
          </p>
          <p>
            {t("lastModified")}:{" "}
            {formatDistanceToNow(updatedAt ? new Date(updatedAt) : new Date(), {
              addSuffix: true,
              locale: i18n.language === "pl" ? pl : enUS,
            }) || ""}
          </p>
          <p>
            {t("description")}: {description}
          </p>
          <p className="text-gray-400">
            {t("publicity")}: {publicity}
          </p>
          <div className="flex flex-col gap-4 mt-8">
            <p>{t("questionsAndAnswers")}:</p>
            {flashCards.map((flashCard) => {
              return (
                <div key={flashCard.id} className="flex gap-2 items-center">
                  <p className="bg-blue-900 px-4 py-2 rounded-lg shadow">
                    {flashCard.question}
                  </p>
                  <span>-</span>
                  <p className="bg-blue-900 px-4 py-2 rounded-lg shadow">
                    {flashCard.answer}
                  </p>
                </div>
              );
            })}
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
