import {
  TbCardsFilled,
  TbCheckupList,
  TbHome,
  TbLogin2,
  TbLogout,
  TbNotebook,
  TbNotes,
  TbX,
  TbMenu2,
} from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AvatarComponent from "../../Components/AvatarComponent";
import Button from "../../Components/Button";
import {t} from "i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const navigationLinks = [
  { to: "/flashcards", label: 'navFlashCards', icon: TbCardsFilled },
  { to: "/notes", label: "navNotes", icon: TbNotes },
  { to: "/class-register", label: "navClassRegister", icon: TbNotebook },
  { to: "/todo", label: "navTodo", icon: TbCheckupList },
];

export default function Nav({ user, logout }: any) {
  const [isShown, setIsShown] = useState(false);

  const menuLinkClass = (isActive: boolean) =>
    `rounded-full px-4 link flex items-center gap-2 ${
      isActive ? "text-slate-200 !bg-left" : "text-gray-400 bg-bgLght !bg-right"
    }`;

  return (
    <>
      <nav className="2xl:flex flex-row hidden roboto uppercase items-center min-[1700px]:gap-8 gap-4 min-[1700px]:text-2xl text-xl h-8">
        {navigationLinks.map((link, index) => (
          <Fragment key={link.to}>
            <NavLink
              className={({ isActive }) => menuLinkClass(isActive)}
              to={link.to}
            >
              <link.icon />
              {t(link.label)}
            </NavLink>
            {index < navigationLinks.length - 1 && (
              <div className="w-1 rounded-xl h-full bg-bgLght" />
            )}
          </Fragment>
        ))}
      </nav>
      <div
        onClick={() => setIsShown(true)}
        className="roboto uppercase 2xl:hidden flex items-center gap-4 cursor-pointer text-2xl text-gray-400 hover:text-gray-100 transition-colors duration-200"
      >
        <p className="sm:block hidden">{t('navOpenMenu')}</p>
        <TbMenu2 />
      </div>
      <LanguageSwitcher />
      {user.username ? (
        <div className="hidden lg:flex items-center gap-8 roboto text-3xl">
          <NavLink
            to={`/profile/${user.id}`}
            className={({ isActive }) =>
              `flex items-center gap-2 transition ${
                isActive ? "text-gray-100" : "text-gray-400"
              } `
            }
          >
            <AvatarComponent
              userId={+(user.id || -10)}
              userName={user.username}
              size="2rem"
            />
            {user.username}
          </NavLink>
          <Button
            type="default"
            className="roboto text-center"
            width="w-36"
            onClick={logout}
          >
            {t("navLogout")}
            <TbLogout />
          </Button>
        </div>
      ) : (
        <Button
          type="default"
          isLink
          to="/login"
          className="roboto text-center"
          width="w-48"
        >
          {t("navLogin")}
          <TbLogin2 />
        </Button>
      )}
      <AnimatePresence>
        {isShown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="2xl:hidden fixed w-screen h-screen top-0 left-0 block bg-bgClr opacity-40"
          />
        )}
      </AnimatePresence>
      <nav
        className={`z-50 2xl:hidden flex-col flex roboto uppercase items-center justify-center gap-8 text-2xl xl:w-1/4 lg:w-1/3 md:w-1/2 w-screen h-screen fixed top-0 duration-300 ${
          isShown
            ? "right-0 "
            : "xl:-right-1/4 lx:-right-1/3 md:-right-1/2 -right-full"
        } bg-bgLght transition-all`}
      >
        <div
          onClick={() => setIsShown(false)}
          className="roboto flex items-center gap-4 cursor-pointer text-2xl text-gray-400 hover:text-gray-100 transition-colors duration-200"
        >
          {t("navClose")}
          <TbX />
        </div>
        <NavLink className={({ isActive }) => menuLinkClass(isActive)} to="/">
          <TbHome />
          {t("navHome")}
        </NavLink>
        {navigationLinks.map((link) => (
          <NavLink
            className={({ isActive }) => menuLinkClass(isActive)}
            to={link.to}
            key={link.to}
          >
            <link.icon />
            {t(link.label)}
          </NavLink>
        ))}
        {user.username ? (
          <div className="lg:hidden flex flex-col items-center gap-8 roboto text-3xl">
            <NavLink
              to={`/profile/${user.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2 transition ${
                  isActive ? "text-gray-100" : "text-gray-400"
                } `
              }
            >
              <AvatarComponent
                userId={+(user.id || -10)}
                userName={user.username}
                size="2rem"
              />
              {user.username}
            </NavLink>
            <Button
              type="default"
              className="roboto text-center"
              width="w-36"
              onClick={logout}
            >
              {t("navLogout")}
              <TbLogout />
            </Button>
          </div>
        ) : (
          <Button
            type="default"
            isLink
            to="/login"
            className="roboto text-center"
            width="w-48"
          >
            {t("navLogin")}
            <TbLogin2 />
          </Button>
        )}
          <LanguageSwitcher />
      </nav>
    </>
  );
}
