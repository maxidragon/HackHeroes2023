import { motion, useIsPresent } from "framer-motion";
import Input from "../../Components/Input.tsx";
import { useRef } from "react";
import Button from "../../Components/Button.tsx";
import { useState } from "react";

export default function CreateFlashcards() {

  const isPresent = useIsPresent();

  const [flashcards, setFlashcards] = useState([
    {
      concept: "",
      definition: ""
    }
  ]);
  const titleRef = useRef<HTMLInputElement>(null);

  const addFlashcard = () => {

    setFlashcards(prev => {
      return [...prev, {
        concept: "",
        definition: ""
      }];
    });
  };

  const removeLastFlashcard = () => {

    setFlashcards(prev => {
      return [...prev].slice(0, -1);
    });
  };

  const createSet = () => {

    const flashcardsArray = [];

    const set = {
      title: titleRef.current.value,
      flashcards: flashcardsArray
    };

    flashcards.map((flashcard, index) => {
      const concept = document.querySelector(`#concept-${index}`).value;
      const definition = document.querySelector(`#definition-${index}`).value;

      flashcardsArray.push({
        id: index,
        concept,
        definition
      });
    });

    console.log(set);
  };

  return (
    <div className="py-10 flex flex-col items-center gap-8 w-[80%] mx-auto max-w-[1300px]">
      <div className="flex justify-between items-center w-full sticky top-3 p-4 bg-violet-950 rounded-2xl z-20">
        <h2 className="text-3xl">Create new flashcards set!</h2>
        <Button type="default" onClick={createSet}>Create</Button>
      </div>
      <Input containerClassName="w-full" className="sm:w-full" placeholder="Title" ref={titleRef} type="text" />
      {flashcards.map((flashcard, index) => {
        return (
          <div className="w-full p-5 flex flex-col gap-4 border-4 border-violet-900 rounded-lg">
            <p className="text-white">Flashcard nr. {index + 1}</p>
            <Input className="sm:w-full" id={`concept-${index}`} placeholder="Concept" />
            <Input className="sm:w-full" id={`definition-${index}`} placeholder="Definition" />
          </div>
        );
      })}
      <div className="flex gap-4 w-full justify-center">
        {flashcards.length > 1 ? <Button type="alt" className="w-fit" onClick={removeLastFlashcard}>Delete</Button> : ""}
        <Button type="alt" className="w-fit" onClick={addFlashcard}>Add</Button>
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