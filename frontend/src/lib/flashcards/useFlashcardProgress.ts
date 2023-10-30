import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

interface flashcard {
  id: number,
  question: string,
  answer: string
}

interface progressSet {
  id: number,
  actualIndex: number,
  correctAnswers: flashcard[],
  wrongAnswers: flashcard[],
  flashcardsLeft: flashcard[]
}

const progress = atomWithStorage<progressSet[]>("progress", []);


const useFlashcardProgress = () => {

  const [progressSets, setProgressSets] = useAtom(progress);

  // get progress to single flashcards set
  const getSingleSet = (id: number) => {
    return progressSets.filter(flashcardSet => flashcardSet.id === id);
  };

  const updateSet = (updatedSet: progressSet) => {

    const { id } = updatedSet;

    setProgressSets(prevState => {

      const otherSets = prevState.filter(flashcardSet => flashcardSet.id !== id);
      return [...otherSets, updatedSet];
    });
  };

  return {
    getSingleSet,
    updateSet
  };
};

export default useFlashcardProgress;