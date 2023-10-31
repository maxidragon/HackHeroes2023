import { motion, useIsPresent } from "framer-motion";
import { t } from "i18next";
import Logo from "../../graphics/logo.svg";
import Button from "../../Components/Button";
import { TbArrowBigDownFilled } from "react-icons/tb";
import AnimatedSvgBg from "./Assets/AnimatedSvgBg";
import { userAtom } from "../../Atoms";
import { useAtomValue } from "jotai";

export default function Home() {
  const isPresent = useIsPresent();
  const user = useAtomValue(userAtom);

  return (
    <div className="flex-1 pb-10 flex flex-col items-center">
      <div className="w-full h-screen flex items-center justify-evenly coolBg">
        <div className="w-1/4 flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-7xl text-white roboto mb-8 text-center">
            Edu Sphere
          </h1>
          <p className="text-xl text-white roboto">{t("home1")}</p>
          <p className="text-xl text-white roboto">{t("home2")}</p>
          <div className="w-full h-1 rounded-full bg-gray-500" />
          <div className="w-full flex items-center gap-4">
            <Button type="alt" className="mt-4" isLink to="/register">
              Register
            </Button>
            <Button type="default" className="mt-4" isLink to="/login">
              Login
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
        <img src={Logo} alt="Edu sphere's logo" className="w-1/4" />
      </div>
      <div className="w-full h-32" />
      <div className="w-full h-screen flex items-center justify-evenly coolBg2">
        <img src={Logo} alt="Edu sphere's logo" className="w-1/4" />
        <div className="w-1/4 flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-7xl text-white roboto mb-8 text-center capitalize">
            {t("navFlashCards")}
          </h1>
          <p className="text-xl text-white roboto text-right">
            {t("homeFlashcards1")}
          </p>
          <p className="text-xl text-white roboto text-right">
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
      <div className="w-full h-screen flex items-center justify-evenly relative overflow-y-hidden">
        <AnimatedSvgBg />
        <div className="w-1/4 flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-7xl text-white roboto mb-8 text-center">
            {t("navNotes")}
          </h1>
          <p className="text-xl text-white roboto">{t("homeNotes1")}</p>
          <p className="text-xl text-white roboto">{t("homeNotes2")}</p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button type="default" className="!w-full mt-4" isLink to="/notes">
            {t("homeToNotes")}
          </Button>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
        <img src={Logo} alt="Edu sphere's logo" className="w-1/4" />
      </div>
      <div className="w-full h-32" />
      <div className="w-full h-screen flex items-center justify-evenly relative overflow-y-hidden">
        <img src={Logo} alt="Edu sphere's logo" className="w-1/4" />
        <div className="w-1/4 flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-6xl text-white roboto mb-8 text-center capitalize">
            {t("navClassRegister")}
          </h1>
          <p className="text-xl text-white roboto text-right">
            {t("homeClassRegister1")}
          </p>
          <p className="text-xl text-white roboto text-right">
            {t("homeClassRegister2")}
          </p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button
            type="default"
            className="!w-full mt-4 text-center"
            isLink
            to="/class-register"
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
      <div className="w-full h-screen flex items-center justify-evenly relative overflow-y-hidden">
        <div className="w-1/4 flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-6xl text-white roboto mb-8 text-center capitalize">
            {t("navTodo")}
          </h1>
          <p className="text-xl text-white roboto">{t("homeToDo1")}</p>
          <p className="text-xl text-white roboto">{t("homeToDo2")}</p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button
            type="default"
            className="!w-full mt-4 text-center"
            isLink
            to="/todo"
          >
            {t("homeToToDo")}
          </Button>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
        <img src={Logo} alt="Edu sphere's logo" className="w-1/4" />
        <div className="air air1" />
        <div className="air air2" />
        <div className="air air3" />
        <div className="air air4" />
      </div>
      <div className="w-full h-32" />
      <div className="w-full h-screen flex items-center justify-evenly relative overflow-y-hidden">
        <img src={Logo} alt="Edu sphere's logo" className="w-1/4" />
        <div className="w-1/4 flex flex-col gap-4 p-8 bg-gray-300 bg-opacity-10 backdrop-blur-2xl rounded-xl">
          <h1 className="text-6xl text-white roboto mb-8 text-center capitalize">
            {t("homeProfileTitle")}
          </h1>
          <p className="text-xl text-white roboto text-right">
            {t("homeProfile1")}
          </p>
          <p className="text-xl text-white roboto text-right">
            {t("homeProfile2")}
          </p>
          <div className="w-full h-1 rounded-full bg-white" />
          <Button
            type="default"
            className="!w-full mt-4 text-center"
            isLink
            to={user.id ? `/profile/${user.id}` : "/login"}
          >
            {t("homeToProfile")}
          </Button>
          <div className="flex items-center justify-center gap-4 text-md text-white ">
            <h2 className="text-center">{t("homeScroll")}</h2>
            <TbArrowBigDownFilled className="animate-bounce" />
          </div>
        </div>
      </div>
      <p className="text-center text-2xl text-white mb-10">{t("homeEndTitle")}</p>
      <Button type="default" onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}>{t("homeBackToTop")}</Button>
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
