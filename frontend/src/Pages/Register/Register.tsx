import { Link, useNavigate } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useRef } from "react";
import toast from "react-hot-toast";
import { TbArrowLeft } from "react-icons/tb";
import { t } from "i18next";

export default function Register() {
  const isPresent = useIsPresent();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const register = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (
      !emailRef.current?.value ||
      !passwordRef.current?.value ||
      !repeatPasswordRef.current?.value ||
      !usernameRef.current?.value
    ) {
      toast.error(t('registerErrorsAllFieldsRequired'));
      return;
    } else if (!emailRegex.test(emailRef.current?.value)) {
      toast.error(t('registerErrorsInvalidEmail'));
      return;
    } else if (
      passwordRef.current?.value !== repeatPasswordRef.current?.value
    ) {
      toast.error(t('registerErrorsPasswordsDontMatch'));
      return;
    } else if (passwordRef.current?.value.length < 8) {
      toast.error(t('registerErrorsPasswordIsTooShort'));
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        username: usernameRef.current?.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400) {
          toast.error(t('registerErrorsDataAlreadyTaken'));
          return;
        } else {
          toast.success(t('registerSuccess'))
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error(t('registerErrorsSomethingWentWrong'));
        console.log(err);
      });
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="xl:w-1/3 lg:w-1/2 w-screen flex flex-col items-center justify-center gap-6 relative">
        <Link
          className="absolute top-4 left-4 text-gray-400 flex items-center gap-2 hover:text-white transition-all"
          to="/"
        >
          <TbArrowLeft />
          {t("registerBackToHome")}
        </Link>
        <h1 className="text-7xl mb-16 roboto">Register</h1>
        <Input
          placeholder={t("registerUsername")}
          ref={usernameRef}
          containerClassName="sm:w-96 w-72"
        />
        <Input
          placeholder={t("registerEmail")}
          type="email"
          ref={emailRef}
          containerClassName="sm:w-96 w-72"
        />
        <Input
          placeholder={t("registerPassword")}
          type="password"
          ref={passwordRef}
          containerClassName="sm:w-96 w-72"
        />
        <Input
          placeholder={t("registerRepeatPassword")}
          type="password"
          ref={repeatPasswordRef}
          containerClassName="sm:w-96 w-72"
        />
        <Button type="default" onClick={register}>
          {t("registerTitle")}
        </Button>
        <Link to="/login">{t("registerLoginLink")}</Link>
      </div>
      <img
        src={background}
        className="xl:w-2/3 lg:w-1/2 hidden lg:block h-screen"
        alt=""
      />
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{
          scaleX: 0,
          transition: { duration: 0.6, ease: "circOut" },
        }}
        exit={{ scaleX: 1, transition: { duration: 0.6, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen bg-indigo-400 z-50"
      />
    </div>
  );
}
