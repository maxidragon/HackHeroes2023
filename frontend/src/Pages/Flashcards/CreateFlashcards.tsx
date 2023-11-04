import { motion, useIsPresent } from "framer-motion";
import Input from "../../Components/Input.tsx";
import { ChangeEvent, useRef } from "react";
import Button from "../../Components/Button.tsx";
import { useState } from "react";
import Select from "../../Components/Select.tsx";
import { t } from "i18next";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";

interface flashcard {
  key?: number;
  concept: string;
  definition: string;
}

export default function CreateFlashcards() {
  const isPresent = useIsPresent();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([
    {
      key: Date.now(),
      concept: "",
      definition: "",
    },
  ]);

  const titleRef = useRef<HTMLInputElement>(null);
  const publicityRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const addFlashcard = () => {
    setFlashcards((prev) => {
      return [
        ...prev,
        {
          key: Date.now(),
          concept: "",
          definition: "",
        },
      ];
    });
  };

  const updateQuestion = (value: string, index: number) => {
    setFlashcards((prevState) => {
      const updatedArr = [...prevState];
      updatedArr[index].concept = value;
      return updatedArr;
    });
  };

  const updateAnswer = (value: string, index: number) => {
    setFlashcards((prevState) => {
      const updatedArr = [...prevState];
      updatedArr[index].definition = value;
      return updatedArr;
    });
  };

  const removeFlashcardByIndex = (index: number) => {
    setFlashcards((prevState) => {
      const newFlashcards = [...prevState];
      newFlashcards.splice(index, 1);
      return newFlashcards;
    });
  };

  const createSet = async () => {
    const flashcardsArray: flashcard[] = [];

    flashcards.map((_flashcard: flashcard) => {
      flashcardsArray.push({
        concept: _flashcard.concept,
        definition: _flashcard.definition,
      });
    });

    if (titleRef.current?.value.length === 0) {
      return toast.error(t("flashCardsTitleEmpty"));
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/flashcard/set`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: titleRef.current?.value || "",
          description: descriptionRef.current?.value || "",
          publicity: publicityRef.current?.value || "PRIVATE",
          flashCards: flashcardsArray,
        }),
      }
    );

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
      <div className="w-full flex gap-4">
        <Input
          containerClassName="w-full"
          className="sm:w-full"
          placeholder={t("title")}
          ref={titleRef}
          type="text"
        />
        <Select ref={publicityRef} defaultValue={"PRIVATE"}>
          <option value="PRIVATE">{t("private")}</option>
          <option value="PUBLIC">{t("public")}</option>
          <option value="CLASS">{t("class")}</option>
        </Select>
      </div>
      <div className="w-full flex flex-col gap-4">
        <label htmlFor="flashcards-desc" className="text-white text-xl">
          {t("description")}
        </label>
        <textarea
          ref={descriptionRef}
          placeholder={t("flashCardsDescriptionPlaceHolder")}
          id="flashcards-desc"
          className="h-full block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
        ></textarea>
      </div>
      {flashcards.map((_flashcard: flashcard, index) => {
        return (
          <>
            <div key={_flashcard.key} className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className="text-white text-lg">Flashcard nr. {index + 1}</p>
                {flashcards.length > 1 && (
                  <Button
                    type="alt"
                    width="w-42"
                    className="text-lg"
                    onClick={() => {
                      removeFlashcardByIndex(index);
                    }}
                  >
                    <FaXmark />
                  </Button>
                )}
              </div>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuestion(e.target.value, index)}
                className="sm:w-full"
                value={_flashcard.concept}
                placeholder={t("concept")}
              />
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateAnswer(e.target.value, index)}
                className="sm:w-full"
                value={_flashcard.definition}
                placeholder={t("definition")}
              />
            </div>
            {index !== flashcards.length - 1 && (
              <div className="w-full h-1 bg-bgLght rounded-full" />
            )}
          </>
        );
      })}
      <div className="flex gap-4 w-full sm:flex-row flex-col justify-center">
        <Button type="default" width="w-full" onClick={addFlashcard}>
          {t("add")}
        </Button>
        <Button type="alt" width="w-full" onClick={createSet}>
          {t("createBtn")}
        </Button>
      </div>
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
