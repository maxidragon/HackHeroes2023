import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import Logo from "../../graphics/logo.svg";
import Button from "../../Components/Button";
import { TbArrowBigDownFilled } from "react-icons/tb";
import AnimatedSvgBg from "./Assets/AnimatedSvgBg";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Atoms";
import notes from "./Assets/notes.png";
import grades from "./Assets/grades.png";
import todo from "./Assets/todo.png";
import flashcards from "./Assets/flashcards.png";

export default function Home() {
  const user = useAtomValue(userAtom);
  const isPresent = useIsPresent();

  return (
    <div className="flex-1 pb-10 flex flex-col items-center">
      <div className="w-full min-h-screen flex lg:flex-row flex-col p-16 px-8 gap-16 items-center justify-evenly coolBg">
        <div className="2xl:w-1/4 lg:w-1/3 md:w-1/2 w-full flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-6xl max-[500px]:text-4xl text-white roboto mb-8 text-center">
            EduSphere
          </h1>
          <p className="sm:text-xl text-lg text-white roboto text-justify sm:text-left">
            {t("home1")}
          </p>
          <p className="sm:text-xl text-lg text-white roboto text-justify sm:text-left">
            {t("home2")}
          </p>
          <div className="w-full h-1 rounded-full bg-gray-500" />
          <div className="w-full flex items-center max-[500px]:flex-col gap-4">
            <Button type="alt" className="mt-4 w-full" isLink to="/register">
              {t("register")}
            </Button>
            <Button type="default" className="mt-4 w-full" isLink to="/login">
              {t("login")}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
        <img
          src={Logo}
          alt="Edu sphere's logo"
          className="2xl:w-1/4 sm:w-1/3 w-full"
        />
      </div>
      <div className="w-full h-32" />
      <div className="w-full min-h-screen flex lg:flex-row flex-col-reverse p-16 px-8 gap-16 items-center justify-evenly coolBg2">
        <img
          src={flashcards}
          className="lg:w-1/2 w-full rounded-xl border-2 border-gray-500"
        />
        <div className="2xl:w-1/4 lg:w-1/3 md:w-1/2 w-full flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-7xl text-white roboto mb-8 text-center capitalize">
            {t("navFlashCards")}
          </h1>
          <p className="text-xl text-white roboto text-justify sm:text-right">
            {t("homeFlashcards1")}
          </p>
          <p className="text-xl text-white roboto text-justify sm:text-right">
            {t("homeFlashcards2")}
          </p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button
            type="default"
            className="!w-full mt-4"
            isLink
            to="/flashcards"
          >
            {t("homeToFlashcards")}
          </Button>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
      </div>
      <div className="w-full h-32" />
      <div className="w-full min-h-screen flex xl:flex-row flex-col p-16 px-8 gap-16 items-center justify-evenly relative">
        <AnimatedSvgBg />
        <div className="2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-7xl text-white roboto mb-8 text-center">
            {t("navNotes")}
          </h1>
          <p className="text-xl text-white roboto text-justify sm:text-left">
            {t("homeNotes1")}
          </p>
          <p className="text-xl text-white roboto text-justify sm:text-left">
            {t("homeNotes2")}
          </p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button type="default" className="!w-full mt-4" isLink to="/notes">
            {t("homeToNotes")}
          </Button>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
        <img
          src={notes}
          className="lg:w-1/2 w-full rounded-xl border-2 border-gray-500"
        />
      </div>
      <div className="w-full h-32" />
      <div className="w-full min-h-screen flex xl:flex-row flex-col-reverse p-16 px-8 gap-16 items-center justify-evenly overflow-hidden relative">
        <img
          src={grades}
          className="lg:w-1/2 w-full rounded-xl border-2 border-gray-500"
        />
        <div className="2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-6xl text-white roboto mb-8 text-center capitalize">
            {t("navClassRegister")}
          </h1>
          <p className="text-xl text-white roboto text-justify sm:text-right">
            {t("homeClassRegister1")}
          </p>
          <p className="text-xl text-white roboto text-justify sm:text-right">
            {t("homeClassRegister2")}
          </p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button
            type="default"
            className="!w-full mt-4 text-center"
            isLink
            to={user.id ? "/class-register" : "/login"}
          >
            {t("homeToClassRegister")}
          </Button>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
        <div className="coolBg3 absolute left-0 top-0 w-full h-full -z-10"></div>
      </div>
      <div className="w-full h-32" />
      <div className="w-full min-h-screen flex xl:flex-row flex-col-reverse p-16 px-8 gap-16 items-center justify-evenly overflow-y-hidden relative">
        <div className="2xl:w-1/4 xl:w-1/3 md:w-1/2 w-full flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-6xl text-white roboto mb-8 text-center capitalize">
            {t("navTodo")}
          </h1>
          <p className="text-xl text-white roboto text-justify sm:text-left">
            {t("homeToDo1")}
          </p>
          <p className="text-xl text-white roboto text-justify sm:text-left">
            {t("homeToDo2")}
          </p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button
            type="default"
            className="!w-full mt-4 text-center"
            isLink
            to={user.id ? "/todo" : "/login"}
          >
            {t("homeToToDo")}
          </Button>
        </div>
        {/* 
          Yep, those are my grades.
          ~Tomasz Mamala
        */}
        <img src={todo} className="lg:w-1/2 w-full" />
        <div className="air air1" />
        <div className="air air2" />
        <div className="air air3" />
        <div className="air air4" />
      </div>
      <div className="w-full h-32" />
      <p className="text-center text-2xl text-white mb-10">
        {t("homeEndTitle")}
      </p>
      <Button
        type="default"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {t("homeBackToTop")}
      </Button>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.6, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen z-50"
      />
    </div>
  );
}
