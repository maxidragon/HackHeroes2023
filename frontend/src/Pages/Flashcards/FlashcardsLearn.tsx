import { motion, useIsPresent } from "framer-motion";
import { useParams } from "react-router-dom";
import getFlashcardSet from "../../lib/flashcards/getFlashcardSet.ts";
import { useEffect, useReducer, useState } from "react";
import Button from "../../Components/Button.tsx";
import useFlashcardProgress from "../../lib/flashcards/useFlashcardProgress.ts";
import { t } from "i18next";

interface flashcard {
  id: number,
  question: string,
  answer: string,
}

interface progressSet {
  id: number,
  allFlashcards: flashcard[],
  correctAnswers: flashcard[],
  wrongAnswers: flashcard[],
  flashcardsLeft: flashcard[]
}

interface action {
  type: string,
  payload?: any
}

export default function FlashcardsLearn() {

  const isPresent = useIsPresent();

  const { getSingleSet, updateSet } = useFlashcardProgress();
  const { id } = useParams();

  const learnReducer = (state: progressSet, action: action) => {

    let updatedSet;
    let updatedLeft = [];

    switch (action.type) {
      case "CORRECT":
        const updatedCorrectAnswers = [...state.correctAnswers, state.flashcardsLeft[0]];
        // updatedLeft = state.flashcardsLeft.filter((card, index) => index !== 0);

        for (let i = 1; i < state.flashcardsLeft.length; i++) {
          updatedLeft.push(state.flashcardsLeft[i]);
        }

        updatedSet = {
          ...state,
          flashcardsLeft: updatedLeft,
          correctAnswers: updatedCorrectAnswers
        };

        updateSet(updatedSet);

        return updatedSet;
      case "WRONG":
        const updatedWrongAnswers = [...state.wrongAnswers, state.flashcardsLeft[0]];

        for (let i = 1; i < state.flashcardsLeft.length; i++) {
          updatedLeft.push(state.flashcardsLeft[i]);
        }

        updatedSet = {
          ...state,
          flashcardsLeft: updatedLeft,
          wrongAnswers: updatedWrongAnswers
        };

        updateSet(updatedSet);

        return updatedSet;
      case "LOAD_PROGRESS":
        return action.payload;
      case "UPDATE_ALL_FLASHCARDS":

        return {
          ...state,
          allFlashcards: [...action.payload.flashcards]
        };
      case "UPDATE":

        const { flashcards, id } = action.payload;

        return {
          id,
          allFlashcards: [...flashcards],
          flashcardsLeft: [...flashcards],
          correctAnswers: [],
          wrongAnswers: []
        };
      case "NEXT_ROUND":

        if (state.wrongAnswers.length === 0) {
          return {
            ...state,
            wrongAnswers: [],
            correctAnswers: [],
            flashcardsLeft: [...state.allFlashcards]
          };
        }

        return {
          ...state,
          wrongAnswers: [],
          flashcardsLeft: [...state.wrongAnswers]
        };

      default:
        return state;
    }
  };

  const learnInitializer = () => {
    return {
      id: -1,
      flashcardsLeft: [],
      correctAnswers: [],
      wrongAnswers: []
    };
  };

  const [learningSet, learningSetDispatch] = useReducer(learnReducer, null, learnInitializer);

  const [side, setSide] = useState(0);

  const changeFlashCardSide = () => {
    setSide(prevState => {
      return prevState ? 0 : 1;
    });
  };

  useEffect(() => {

    if (id) {

      const savedProgressSet = getSingleSet(parseInt(id));
      console.log(savedProgressSet);

      if (savedProgressSet) {
        learningSetDispatch({ type: "LOAD_PROGRESS", payload: savedProgressSet });
      }

      getFlashcardSet(id).then(({ flashCards }) => {

        if (savedProgressSet) {
          learningSetDispatch({
            type: "UPDATE_ALL_FLASHCARDS",
            payload: {
              flashcards: flashCards
            }
          });
        } else {
          learningSetDispatch({
            type: "UPDATE", payload: {
              id,
              flashcards: flashCards
            }
          });
        }
      });
    }
  }, [id]);

  return (
    <div className="mx-auto w-[80%] max-w-[1300px] text-white">

      {learningSet.flashcardsLeft.length > 0 &&
        <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2">
          <div className="min-w-[300px] bg-violet-950 p-6 rounded-2xl cursor-pointer" onClick={changeFlashCardSide}>
            {side ? <p className="text-center text-2xl">{learningSet.flashcardsLeft[0].answer}</p> :
              <p className="text-center text-2xl">{learningSet.flashcardsLeft[0].question}</p>}
          </div>
          <div className="flex gap-4 mt-10">
            <Button onClick={() => {
              learningSetDispatch({ type: "WRONG" });
            }} type={"default"}>{t("iDoNotKnow")}</Button>
            <Button onClick={() => {
              learningSetDispatch({ type: "CORRECT" });
            }} type={"default"}>{t("iKnow")}</Button>
          </div>
        </div>}

      {learningSet.flashcardsLeft.length === 0 && <div className="py-8 flex flex-col gap-8">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl py-4">{t("youKnowThis")}:</h3>
            <Button onClick={() => {
              learningSetDispatch({ type: "NEXT_ROUND" });
            }} width="w-42" className="text-lg py-1.5 px-3"
                    type="default">{t("nextRound")}</Button>
          </div>
          <div className="flex flex-col gap-2">
            {learningSet.correctAnswers.map((flashcard: flashcard) => {
              return <p className="text-green-500" key={flashcard.id}>{flashcard.question} - {flashcard.answer}</p>;
            })}
          </div>
        </div>
        <div>
          <h3 className="text-2xl py-4">{t("youShouldRepeatThis")}:</h3>
          <div className="flex flex-col gap-2">
            {learningSet.wrongAnswers.map((flashcard: flashcard) => {
              return <p className="text-red-500" key={flashcard.id}>{flashcard.question} - {flashcard.answer}</p>;
            })}
          </div>
        </div>
      </div>}

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