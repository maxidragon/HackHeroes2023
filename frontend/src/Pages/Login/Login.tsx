import { Link, useNavigate } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../Atoms";
import getUserObject from "../../lib/getUser";
import { TbArrowLeft } from "react-icons/tb";
import { t } from "i18next";
import { ThreeDots } from "react-loader-spinner";

export default function Login() {
  const isPresent = useIsPresent();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!emailRef.current?.value || !passwordRef.current?.value) {
      toast.error(t('loginErrorsAllFieldsRequired'));
      return;
    } else if (!emailRegex.test(emailRef.current?.value)) {
      toast.error(t('invalidEmail'));
      return;
    }
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400) {
          setIsLoading(false);
          toast.error(t('loginErrorsInvalidCredentials'));
          return;
        } else {
          toast.success(t('loginSuccess'));
          setUser(() => getUserObject());
          setTimeout(() => {
            setIsLoading(false);
            navigate("/");
          }, 750);
        }
      })
      .catch((err) => {
        setIsLoading(false);
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
        <h1 className="text-7xl mb-16 roboto">Login</h1>
        <Input
          placeholder={t("loginEmail")}
          ref={emailRef}
          type="email"
          disabled={isLoading}
          containerClassName="sm:w-96 w-72"
        />
        <Input
          containerClassName="sm:w-96 w-72"
          placeholder={t("loginPassword")}
          type="password"
          disabled={isLoading}
          ref={passwordRef}
        />
        <ThreeDots
          height={40}
          width={40}
          visible={isLoading}
        />
        <Button type="default" onClick={login} disabled={isLoading}>
          {t("login")}
        </Button>
        <Link to="/register">{t("loginRegisterLink")}</Link>
        <Link to="/password/forgot">{t("forgotPasswordLink")}</Link>
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
