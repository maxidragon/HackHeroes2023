import { motion, useIsPresent } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../Components/Button.tsx";
import getFlashcardSet from "../../lib/flashcards/getFlashcardSet.ts";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface user {
  id: number,
  username: string
}

interface flashCards {
  id: number,
  question: string,
  answer: string
}

interface flashcardSet {
  title: string,
  description?: string,
  id: number,
  forkedFrom?: user,
  user: user,
  flashCards: flashCards[]
  publicity: string,
  createdAt: string,
  updatedAt: string
}

export default function FlashcardsDetails() {
  const isPresent = useIsPresent();
  const [{
    title,
    user,
    createdAt,
    updatedAt,
    forkedFrom,
    description,
    publicity,
    flashCards
  }, setFlashcardSet] = useState<flashcardSet>({
    createdAt: "",
    description: "",
    flashCards: [],
    forkedFrom: undefined,
    id: 0,
    publicity: "",
    title: "",
    updatedAt: "",
    user: {
      username: "",
      id: 0
    }
  });

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getFlashcardSet(id).then(data => {
        setFlashcardSet(data);
      });
    }
  }, [id]);

  return (
    <div className="flex-1 text-white py-6 w-[80%] max-w-[1300px] mx-auto">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-3xl py-4">{title}</h2>
        <Button isLink={true} to={`/flashcards/learn/${id}`} className="text-lg px-4 py-2 mt-8" width="w-42"
                type="default">Start learning</Button>
      </div>
      <p>Author: <Link to={`/profile/${user.id}`}>{user.username}</Link></p>
      {forkedFrom && <p>Forked from: <Link to={`/profile/${forkedFrom.id}`}>{forkedFrom.username}</Link></p>}
      <p>Created at: {formatDistanceToNow(createdAt ? new Date(createdAt) : new Date(), { addSuffix: true }) || ""}</p>
      <p>Last
        modified: {formatDistanceToNow(updatedAt ? new Date(updatedAt) : new Date(), { addSuffix: true }) || ""}</p>
      <p>Description: {description}</p>
      <p className="text-gray-400">Publicity: {publicity}</p>
      <div className="flex flex-col gap-4 mt-8">
        <p>Questions and Answers:</p>
        {flashCards.map(flashCard => {
          return (
            <div key={flashCard.id} className="flex gap-2 items-center">
              <p className="bg-blue-900 px-4 py-2 rounded-lg shadow">{flashCard.question}</p>
              <span>-</span>
              <p className="bg-blue-900 px-4 py-2 rounded-lg shadow">{flashCard.answer}</p>
            </div>
          );
        })}
      </div>

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