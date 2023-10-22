import { motion, useIsPresent } from "framer-motion";
import Input from "../../Components/Input.tsx";
import { useRef } from "react";
import Button from "../../Components/Button.tsx";
import { useState } from "react";
import Select from "../../Components/Select.tsx";

interface flashcard {
  concept: string,
  definition: string
}

export default function CreateFlashcards() {

  const isPresent = useIsPresent();

  const [flashcards, setFlashcards] = useState([
    {
      concept: "",
      definition: ""
    }
  ]);

  const titleRef = useRef<HTMLInputElement>(null);
  const publicityRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);


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

  const createSet = async () => {

    const flashcardsArray: flashcard[] = [];

    flashcards.map((_flashcard, index) => {
      const concept = (document.querySelector(`#concept-${index}`) as HTMLInputElement).value || "";
      const definition = (document.querySelector(`#definition-${index}`) as HTMLInputElement).value || "";


      flashcardsArray.push({
        concept,
        definition
      });
    });

    if (titleRef.current?.value.length === 0) throw Error("Title must be filled!");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        title: titleRef.current?.value || "",
        description: descriptionRef.current?.value || "",
        publicity: publicityRef.current?.value || "PRIVATE",
        flashCards: flashcardsArray
      })
    });

    if (!response.ok) throw Error("Something went wrong!");

    const data = await response.json();

    console.log(data);
  };

  return (
    <div className="py-10 flex flex-col items-center gap-8 w-[80%] mx-auto max-w-[1300px]">
      <div className="flex justify-between items-center w-full sticky top-3 p-4 bg-violet-950 rounded-2xl z-20">
        <h2 className="text-3xl">Create new flashcards set!</h2>
        <Button type="default" onClick={createSet}>Create</Button>
      </div>
      <div className="w-full flex gap-4">
        <Input containerClassName="w-full" className="sm:w-full" placeholder="Title" ref={titleRef} type="text" />
        <Select ref={publicityRef} defaultValue={"PRIVATE"}>
          <option value="PRIVATE">Private</option>
          <option value="PUBLIC">Public</option>
          <option value="CLASS">Class</option>
        </Select>
      </div>
      <div className="w-full flex flex-col gap-4">
        <label htmlFor="flashcards-desc" className="text-white text-xl">Description</label>
        <textarea
          ref={descriptionRef}
          placeholder="Here goes your description for this awesome flashcards set ..."
          id="flashcards-desc"
          className="h-full block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
        >
      </textarea>
      </div>
      {flashcards.map((_flashcard: flashcard, index) => {
        return (
          <div key={index} className="w-full p-5 flex flex-col gap-4 border-4 border-violet-900 rounded-lg">
            <p className="text-white">Flashcard nr. {index + 1}</p>
            <Input className="sm:w-full" id={`concept-${index}`} placeholder="Concept" />
            <Input className="sm:w-full" id={`definition-${index}`} placeholder="Definition" />
          </div>
        );
      })}
      <div className="flex gap-4 w-full justify-center">
        {flashcards.length > 1 ?
          <Button type="alt" className="w-fit" onClick={removeLastFlashcard}>Delete</Button> : ""}
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