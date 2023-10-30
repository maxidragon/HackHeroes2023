import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

interface flashcard {
  id: number,
  question: string,
  answer: string
}

interface progressSet {
  id: number,
  allFlashcards: flashcard[],
  correctAnswers: flashcard[],
  wrongAnswers: flashcard[],
  flashcardsLeft: flashcard[]
}

const getInitialValue = () => {
  const value = localStorage.getItem("progress");
  return value ? JSON.parse(value) : [];
};

const progress = atomWithStorage<progressSet[] | never[]>("progress", getInitialValue());

const useFlashcardProgress = () => {

  const [progressSets, setProgressSets] = useAtom(progress);

  // get progress to single flashcards set
  const getSingleSet = (id: number) => {
    console.log(progressSets);
    return progressSets.filter(flashcardSet => flashcardSet.id == id)[0];
  };

  const updateSet = (updatedSet: progressSet) => {

    const { id } = updatedSet;

    setProgressSets(prevState => {

      const otherSets = prevState.filter(flashcardSet => flashcardSet.id != id);
      return [...otherSets, updatedSet];
    });
  };

  return {
    getSingleSet,
    updateSet
  };
};

export default useFlashcardProgress;