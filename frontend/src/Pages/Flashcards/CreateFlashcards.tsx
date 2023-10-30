import { motion, useIsPresent } from "framer-motion";
import Input from "../../Components/Input.tsx";
import { useRef } from "react";
import Button from "../../Components/Button.tsx";
import { useState } from "react";
import Select from "../../Components/Select.tsx";
import { t } from "i18next";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface flashcard {
  concept: string,
  definition: string
}

export default function CreateFlashcards() {

  const isPresent = useIsPresent();
  const navigate = useNavigate();

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

    if (titleRef.current?.value.length === 0) {
      return toast.error(t("flashCardsTitleEmpty"));
    }

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

    if (!response.ok) {
      toast.error(t("somethingWentWrong"));
      return;
    }

    toast.success(t("flashCardsCreated"));

    const { id } = await response.json();

    setTimeout(() => {
      return navigate(`/flashcards/details/${id}`);
    }, 750);
  };

  return (
    <div className="py-10 flex flex-col items-center gap-8 w-[80%] mx-auto max-w-[1300px]">
      <div
        className="flex flex-col sm:gap-0 gap-6 sm:flex-row justify-between items-center w-full shadow-2xl sticky top-3 py-4 px-5 bg-blue-900 rounded-2xl z-20">
        <h2 className="text-xl font-bold sm:text-3xl">{t("createNewFlashCardSet")}</h2>
        <Button type="default" onClick={createSet}>{t("createBtn")}</Button>
      </div>
      <div className="w-full flex gap-4">
        <Input containerClassName="w-full" className="sm:w-full" placeholder={t("title")} ref={titleRef} type="text" />
        <Select ref={publicityRef} defaultValue={"PRIVATE"}>
          <option value="PRIVATE">{t("private")}</option>
          <option value="PUBLIC">{t("public")}</option>
          <option value="CLASS">{t("class")}</option>
        </Select>
      </div>
      <div className="w-full flex flex-col gap-4">
        <label htmlFor="flashcards-desc" className="text-white text-xl">{t("description")}</label>
        <textarea
          ref={descriptionRef}
          placeholder={t("flashCardsDescriptionPlaceHolder")}
          id="flashcards-desc"
          className="h-full block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
        >
      </textarea>
      </div>
      {flashcards.map((_flashcard: flashcard, index) => {
        return (
          <div key={index}
               className="w-full p-5 flex flex-col gap-4 border-4 border-blue-600 rounded-lg">
            <p className="text-white text-lg">Flashcard nr. {index + 1}</p>
            <Input className="sm:w-full" id={`concept-${index}`} placeholder={t("concept")} />
            <Input className="sm:w-full" id={`definition-${index}`} placeholder={t("definition")} />
          </div>
        );
      })}
      <div className="flex gap-4 w-full justify-center">
        {flashcards.length > 1 ?
          <Button type="default" width="w-full" onClick={removeLastFlashcard}>{t("delete")}</Button> : ""}
        <Button type="default" width="w-full" onClick={addFlashcard}>{t("add")}</Button>
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