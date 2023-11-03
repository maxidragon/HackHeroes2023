import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

interface flashcard {
  id: number,
  question: string,
  answer: string
}

interface progressSet {
  id: number,
  userId: number,
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
  const getSingleSet = (id: number, userId = -1) => {
    return progressSets.filter(flashcardSet => flashcardSet.id == id && flashcardSet.userId == userId)[0];
  };

  const updateSet = (updatedSet: progressSet) => {

    const { id, userId } = updatedSet;

    let newFlashcardSet = updatedSet;

    if (updatedSet.flashcardsLeft.length === 0 && updatedSet.wrongAnswers.length === 0) {
      newFlashcardSet = {
        ...updatedSet,
        wrongAnswers: [],
        correctAnswers: [],
        flashcardsLeft: [...updatedSet.allFlashcards]
      };
    }

    setProgressSets(prevState => {

      const otherSets = prevState.filter(flashcardSet => flashcardSet.id != id || flashcardSet.userId != userId);
      return [...otherSets, newFlashcardSet];
    });
  };

  return {
    getSingleSet,
    updateSet
  };
};

export default useFlashcardProgress;