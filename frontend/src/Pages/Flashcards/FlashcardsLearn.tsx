import { motion, useIsPresent } from "framer-motion";
import { useParams } from "react-router-dom";
import getFlashcardSet from "../../lib/flashcards/getFlashcardSet.ts";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.tsx";
// import { useAtom } from "jotai";
// import { atomWithStorage } from "jotai/utils";

interface flashcard {
  id: number,
  question: string,
  answer: string,
}

/* interface progressSet {
  id: number,
  actualIndex: number,
  correctAnswers: flashcard[],
  wrongAnswers: flashcard[]
} */

// const learnProgress = atomWithStorage<progressSet[]>("progress", []);

export default function FlashcardsLearn() {

  const isPresent = useIsPresent();

  // const [progress, setProgress] = useAtom(learnProgress);

  const [flashCards, setFlashCards] = useState<flashcard[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<flashcard[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<flashcard[]>([]);
  const [actualIndex, setActualIndex] = useState(0);
  const [side, setSide] = useState(0);

  const { id } = useParams();

  const changeFlashCardSide = () => {
    setSide(prevState => {
      return prevState ? 0 : 1;
    });
  };

  const correct = () => {

    setCorrectAnswers(prevState => {
      return [...prevState, flashCards[actualIndex]];
    });
    setActualIndex(prevState => prevState + 1);
  };

  const wrong = () => {
    setWrongAnswers(prevState => {
      return [...prevState, flashCards[actualIndex]];
    });
    setActualIndex(prevState => prevState + 1);
  };

  const playAgain = () => {
    setActualIndex(0);
    setSide(0);
    setFlashCards([...wrongAnswers]);
    setWrongAnswers([]);
  };

  useEffect(() => {

    if (id) {
      getFlashcardSet(id).then(({ flashCards }) => {
        setFlashCards(flashCards);
      });

      /*
    if (!progress.filter(singleSet => singleSet.id === parseInt(id)).length) {
      setProgress((prevState: progressSet[]) => {
        return [...prevState.filter(state => state.id !== 0), {
          id,
          correctAnswers: [],
          wrongAnswers: []
        }];
      });
    } */
    }
  }, [id]);

  return (
    <div className="mx-auto w-[80%] max-w-[1300px] text-white">

      {flashCards.length && actualIndex < flashCards.length &&
        <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2">
          <div className="min-w-[300px] bg-violet-950 p-6 rounded-2xl cursor-pointer" onClick={changeFlashCardSide}>
            {side ? <p className="text-center text-2xl">{flashCards[actualIndex].answer}</p> :
              <p className="text-center text-2xl">{flashCards[actualIndex].question}</p>}
          </div>
          <div className="flex gap-4 mt-10">
            <Button onClick={wrong} type={"default"}>I do not know</Button>
            <Button onClick={correct} type={"default"}>I do know</Button>
          </div>
        </div>}

      {flashCards.length && flashCards.length <= actualIndex && <div className="py-8 flex flex-col gap-8">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl py-4">You know this:</h3>
            <Button onClick={playAgain} width="w-42" className="text-lg py-1.5 px-3" type="default">Next round</Button>
          </div>
          <div className="flex flex-col gap-2">
            {correctAnswers.map(flashcard => {
              return <p className="text-green-500" key={flashcard.id}>{flashcard.question} - {flashcard.answer}</p>;
            })}
          </div>
        </div>
        <div>
          <h3 className="text-2xl py-4">You should repeat this:</h3>
          <div className="flex flex-col gap-2">
            {wrongAnswers.map(flashcard => {
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