import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useParams } from "react-router-dom";
import getFlashcardSet from "../../lib/flashcards/getFlashcardSet.ts";
import { useEffect, useReducer, useState } from "react";
import Button from "../../Components/Button.tsx";
import useFlashcardProgress from "../../lib/flashcards/useFlashcardProgress.ts";
import { t } from "i18next";
import { TbClick } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import getUserObject from "../../lib/getUser.ts";
import ProgressBar from "../../Components/ProgressBar.tsx";
import ReactCardFlip from "react-card-flip";

interface flashcard {
  id: number;
  question: string;
  answer: string;
}

interface progressSet {
  id: number;
  userId: number;
  allFlashcards: flashcard[];
  correctAnswers: flashcard[];
  wrongAnswers: flashcard[];
  flashcardsLeft: flashcard[];
}

interface action {
  type: string;
  payload?: any;
}

export default function FlashcardsLearn() {
  const isPresent = useIsPresent();
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const { getSingleSet, updateSet } = useFlashcardProgress();
  const { id } = useParams();
  const { id: userId } = getUserObject();

  const learnReducer = (state: progressSet, action: action) => {
    let updatedSet;
    let updatedLeft = [];

    switch (action.type) {
      case "CORRECT":
        const updatedCorrectAnswers = [
          ...state.correctAnswers,
          state.flashcardsLeft[0],
        ];

        for (let i = 1; i < state.flashcardsLeft.length; i++) {
          updatedLeft.push(state.flashcardsLeft[i]);
        }

        updatedSet = {
          ...state,
          flashcardsLeft: updatedLeft,
          correctAnswers: updatedCorrectAnswers,
        };

        updateSet(updatedSet);
        setShowButtons(false);

        return updatedSet;
      case "WRONG":
        const updatedWrongAnswers = [
          ...state.wrongAnswers,
          state.flashcardsLeft[0],
        ];

        for (let i = 1; i < state.flashcardsLeft.length; i++) {
          updatedLeft.push(state.flashcardsLeft[i]);
        }

        updatedSet = {
          ...state,
          flashcardsLeft: updatedLeft,
          wrongAnswers: updatedWrongAnswers,
        };

        updateSet(updatedSet);
        setShowButtons(false);

        return updatedSet;
      case "LOAD_PROGRESS":
        return action.payload;
      case "UPDATE_ALL_FLASHCARDS":
        return {
          ...state,
          allFlashcards: [...action.payload.flashcards],
        };
      case "UPDATE":
        const { flashcards, id } = action.payload;

        return {
          id,
          userId,
          allFlashcards: [...flashcards],
          flashcardsLeft: [...flashcards],
          correctAnswers: [],
          wrongAnswers: [],
        };
      case "NEXT_ROUND":
        if (state.wrongAnswers.length === 0) {
          return {
            ...state,
            wrongAnswers: [],
            correctAnswers: [],
            flashcardsLeft: [...state.allFlashcards],
          };
        }

        return {
          ...state,
          wrongAnswers: [],
          flashcardsLeft: [...state.wrongAnswers],
        };

      default:
        return state;
    }
  };

  const learnInitializer = () => {
    return {
      id: -1,
      userId: -1,
      flashcardsLeft: [],
      correctAnswers: [],
      wrongAnswers: [],
    };
  };

  const [learningSet, learningSetDispatch] = useReducer(
    learnReducer,
    null,
    learnInitializer
  );

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const score =
    learningSet.correctAnswers.length /
    (learningSet.correctAnswers.length + learningSet.wrongAnswers.length);
  const percentage = (Math.round(score * 100) / 100) * 100;

  const changeFlashCardSide = () => {
    setShowButtons(true);
    setIsFlipped((prevState) => {
      return !prevState;
    });
  };

  useEffect(() => {
    if (id) {
      const savedProgressSet = getSingleSet(parseInt(id), userId);

      if (savedProgressSet) {
        learningSetDispatch({
          type: "LOAD_PROGRESS",
          payload: savedProgressSet,
        });
      }

      getFlashcardSet(id).then(({ flashCards }) => {
        if (savedProgressSet) {
          learningSetDispatch({
            type: "UPDATE_ALL_FLASHCARDS",
            payload: {
              flashcards: flashCards,
            },
          });
        } else {
          learningSetDispatch({
            type: "UPDATE",
            payload: {
              id,
              userId,
              flashcards: flashCards,
            },
          });
        }
      });
    }
  }, [id]);

  return (
    <div className="flex-1 mx-auto sm:w-[80%] w-[90%] max-w-[1300px] text-white">
      {learningSet.flashcardsLeft.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full px-4 h-full">
          <h2 className="text-2xl text-center mb-4">{t("flipFlashcard")}</h2>
          <div
            onClick={changeFlashCardSide}
            className="w-full h-[300px] shadow-2xl cursor-pointer flex justify-center items-center"
          >
            <ReactCardFlip
              isFlipped={isFlipped}
              flipDirection="horizontal"
              containerClassName="w-full h-full"
            >
              <div className="bg-purple-600 w-full h-full rounded-2xl flex items-center justify-center flex-col gap-4">
                <TbClick className="absolute left-2 top-2 text-2xl" />
                <p>{t("answer")}:</p>
                <p className="text-center text-2xl sm:text-3xl">
                  {learningSet.flashcardsLeft[0].answer}
                </p>
              </div>
              <div className="bg-purple-600 w-full h-full rounded-2xl flex items-center justify-center flex-col gap-4">
                <TbClick className="absolute left-2 top-2 text-2xl" />
                <p>{t("question")}:</p>
                <p className="text-center text-2xl sm:text-3xl">
                  {learningSet.flashcardsLeft[0].question}
                </p>
              </div>
            </ReactCardFlip>
          </div>
          <AnimatePresence>
            {showButtons && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0 }}
                className="flex flex-col-reverse items-center sm:flex-row gap-4 mt-10 w-full"
              >
                <Button
                  className="sm:py-4 py-2"
                  width="w-full sm:w-96"
                  onClick={() => {
                    learningSetDispatch({ type: "WRONG" });
                  }}
                  type={"default"}
                >
                  <FaXmark />
                  {t("iDoNotKnow")}
                </Button>
                <Button
                  className="sm:py-4 py-2"
                  width="w-full sm:w-96"
                  onClick={() => {
                    learningSetDispatch({ type: "CORRECT" });
                  }}
                  type={"default"}
                >
                  <FaCheck />
                  {t("iKnow")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {learningSet.flashcardsLeft.length === 0 &&
        learningSet.wrongAnswers.length === 0 && (
          <div className="w-full text-center py-8">
            <div className="flex md:flex-row flex-col justify-between items-center mb-8">
              <h2 className="text-2xl py-6">{t("allCorrect")}</h2>
              <div className="flex gap-4 w-full">
                <Button
                  width="md:w-42 w-full"
                  className="text-lg py-1.5 px-3"
                  type="default"
                  isLink={true}
                  to={`/flashcards`}
                >
                  {t("backToFlashcards")}
                </Button>
                <Button
                  onClick={() => {
                    learningSetDispatch({ type: "NEXT_ROUND" });
                  }}
                  width="md:w-42 w-full"
                  className="text-lg py-1.5 px-3"
                  type="alt"
                >
                  {t("playAgain")}
                </Button>
              </div>
            </div>
            <p className="mt-4 p-4 bg-violet-500 rounded-full text-xl">100 %</p>
          </div>
        )}
      {learningSet.flashcardsLeft.length === 0 &&
        learningSet.wrongAnswers.length !== 0 && (
          <div className="py-8 flex flex-col gap-8">
            <div className="w-full">
              <div className="flex md:flex-row flex-col items-center gap-8 mb-6">
                <ProgressBar progress={percentage} display={true} />
                <Button
                  onClick={() => {
                    learningSetDispatch({ type: "NEXT_ROUND" });
                  }}
                  width="w-52"
                  className="text-lg py-1.5 px-3"
                  type="default"
                >
                  {t("nextRound")}
                </Button>
              </div>
              {learningSet.correctAnswers.length > 0 && (
                <div>
                  <h3 className="text-2xl py-4">{t("youKnowThis")}:</h3>
                  <div className="flex flex-col gap-2">
                    {learningSet.correctAnswers.map((flashcard: flashcard) => {
                      return (
                        <p className="text-green-500" key={flashcard.id}>
                          {flashcard.question} - {flashcard.answer}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {learningSet.wrongAnswers.length > 0 && (
              <div>
                <h3 className="text-2xl py-4">{t("youShouldRepeatThis")}:</h3>
                <div className="flex flex-col gap-2">
                  {learningSet.wrongAnswers.map((flashcard: flashcard) => {
                    return (
                      <p className="text-red-500" key={flashcard.id}>
                        {flashcard.question} - {flashcard.answer}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
