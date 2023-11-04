import { motion, useIsPresent } from "framer-motion";
import Input from "../../Components/Input.tsx";
import { ChangeEvent, useEffect, useRef } from "react";
import Button from "../../Components/Button.tsx";
import { useState } from "react";
import Select from "../../Components/Select.tsx";
import { t } from "i18next";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import getFlashcardSet from "../../lib/flashcards/getFlashcardSet.ts";
import { FaXmark } from "react-icons/fa6";
import { Flashcard, FlashcardSet } from "../../lib/interfaces.ts";

export default function EditFlashcards() {

  const isPresent = useIsPresent();
  const { id } = useParams();
  const navigate = useNavigate();

  const [existingSet, setExistingSet] = useState<FlashcardSet>({
    id: 0,
    title: "",
    description: "",
    flashCards: [{ question: "", answer: "", key: Date.now() }],
    publicity: "PRIVATE"
  });

  useEffect(() => {
    if (id) {
      getFlashcardSet(id).then(({ title, description, publicity, flashCards }: FlashcardSet) => {
        const flashcardsWithKey: Flashcard[] = [];
        flashCards.map((flashcard, index) => {
          flashcardsWithKey.push({
            ...flashcard,
            key: Date.now() * (index + 1),
            isDelete: false
          });
        });
        setExistingSet({
          id: +id,
          title,
          description,
          publicity,
          flashCards: flashcardsWithKey
        });
      }).catch(err => {
        toast.error(t("somethingWentWrong"));
        console.error(err);
      });
    }
  }, [id]);

  const titleRef = useRef<HTMLInputElement>(null);
  const publicityRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const updateSet = async () => {

    const flashcardsArray: Flashcard[] = [];

    existingSet.flashCards.map((_flashcard: Flashcard) => {
      flashcardsArray.push({
        id: _flashcard.id,
        question: _flashcard.question,
        answer: _flashcard.answer,
        isDelete: _flashcard.isDelete
      });
    });
    if (titleRef.current?.value.length === 0) {
      return toast.error(t("flashCardsTitleEmpty"));
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/flashcard/set/${id}`, {
      method: "PUT",
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

    toast.success(t("flashcardEdited"));

    const { id: responseId } = await response.json();

    setTimeout(() => {
      return navigate(`/flashcards/details/${responseId}`);
    }, 750);
  };

  const addFlashcard = () => {
    setExistingSet(prev => {
      return {
        ...prev,
        flashCards: [...prev.flashCards, {
          key: Date.now(),
          question: "",
          answer: ""
        }]
      };
    });
  };

  const updateQuestion = (value: string, index: number) => {
    setExistingSet(prevState => {
      const updatedArr = [...prevState.flashCards];
      updatedArr[index].question = value;
      return {
        ...prevState,
        flashCards: updatedArr
      };
    });
  };

  const updateAnswer = (value: string, index: number) => {
    setExistingSet(prevState => {
      const updatedArr = [...prevState.flashCards];
      updatedArr[index].answer = value;
      return {
        ...prevState,
        flashCards: updatedArr
      };
    });
  };

  const removeFlashcardByIndex = (index: number) => {
    setExistingSet(prevState => {
      const newFlashcards = [...prevState.flashCards];
      newFlashcards[index].isDelete = true;
      return {
        ...prevState,
        flashCards: newFlashcards
      };
    });
  };

  return (
    <div className="py-10 flex flex-col items-center gap-8 w-[80%] mx-auto max-w-[1300px]">
      <div
        className="flex flex-col sm:gap-0 gap-6 sm:flex-row justify-between items-center w-full shadow-2xl sticky top-3 py-4 px-5 bg-blue-900 rounded-2xl z-20">
        <h2 className="text-xl font-bold sm:text-3xl">{t("flashcardEdit")}</h2>
        <Button type="default" onClick={updateSet}>{t("save")}</Button>
      </div>
      <div className="w-full flex gap-4">
        <Input containerClassName="w-full" className="sm:w-full" placeholder={t("title")} value={existingSet.title}
          ref={titleRef} type="text" />
        <Select ref={publicityRef} defaultValue={existingSet.publicity}>
          <option value="PRIVATE">{t("private")}</option>
          <option value="PUBLIC">{t("public")}</option>
          <option value="CLASS">{t("class")}</option>
        </Select>
      </div>
      <div className="w-full flex flex-col gap-4">
        <label htmlFor="flashcards-desc" className="text-white text-xl">{t("description")}</label>
        <textarea
          defaultValue={existingSet.description}
          ref={descriptionRef}
          placeholder={t("flashCardsDescriptionPlaceHolder")}
          id="flashcards-desc"
          className="h-full block px-2.5 py-2.5 w-full text-lg text-white bg-transparent rounded-lg border-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600"
        >
        </textarea>
      </div>
      {existingSet.flashCards.map((flashcard: Flashcard, index) => {
        return flashcard.isDelete ? "" : (
          <div key={flashcard.key}
            className="w-full p-5 flex flex-col gap-4 border-4 border-blue-600 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-white text-lg">Flashcard nr. {index + 1}</p>
              {existingSet.flashCards.length > 1 && <Button type="alt" width="w-42" className="text-lg" onClick={() => {
                removeFlashcardByIndex(index);
              }}><FaXmark /></Button>}
            </div>
            <Input className="sm:w-full" placeholder={t("concept")}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuestion(e.target.value, index)}
              value={flashcard.question} />
            <Input className="sm:w-full"
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAnswer(e.target.value, index)}
              placeholder={t("definition")} value={flashcard.answer} />
          </div>
        );
      })}
      <div className="flex gap-4 w-full justify-center">
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