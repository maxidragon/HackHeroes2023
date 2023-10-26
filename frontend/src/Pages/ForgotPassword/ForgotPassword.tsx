import { Link } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useRef } from "react";
import { TbArrowLeft } from "react-icons/tb";
import { t } from "i18next";

export default function ForgotPassword() {
  const isPresent = useIsPresent();
  const emailRef = useRef<HTMLInputElement>(null);

  const login = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRef.current?.value) {
      toast.error(t('loginErrorsAllFieldsRequired'));
      return;
    } else if (!emailRegex.test(emailRef.current?.value)) {
      toast.error(t('invalidEmail'));
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/auth/reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: emailRef.current?.value,
      }),
    })
      .then((res) => {
        if (res.status === 204) {
          toast.success(t('resetEmailSent'));
        } else if (res.status === 404) {
          toast.error(t('wrongEmail'));
        } else {
          toast.error(t('somethingWentWrong'));
        }
      })
      .catch((err) => {
        toast.error(t('somethingWentWrong'));
        console.log(err);
      });
  };

  return (
    <div className="w-screen h-screen flex">
      <img
        src={background}
        className="xl:w-2/3 lg:w-1/2 hidden lg:block h-screen"
        alt=""
      />
      <div className="xl:w-1/3 lg:w-1/2 w-screen flex flex-col items-center justify-center gap-6 relative">
        <Link
          className="absolute top-4 left-4 text-gray-400 flex items-center gap-2 hover:text-white transition-all"
          to="/"
        >
          <TbArrowLeft />
          {t("loginBackToHome")}
        </Link>
        <h1 className="text-6xl mb-16 roboto">{t('forgotPasswordTitle')}</h1>
        <Input
          placeholder={t("loginEmail")}
          ref={emailRef}
          type="email"
          containerClassName="sm:w-96 w-72"
        />
        <Button type="default" onClick={login}>
          {t("sendResetEmail")}
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
        className="privacy-screen bg-indigo-400 z-50"
      />
    </div>
  );
}
