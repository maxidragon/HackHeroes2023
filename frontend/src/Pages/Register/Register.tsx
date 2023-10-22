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
      toast.error(t('register.errors.allFieldsRequired'));
      return;
    } else if (!emailRegex.test(emailRef.current?.value)) {
      toast.error(t('register.errors.invalidEmail'));
      return;
    } else if (
      passwordRef.current?.value !== repeatPasswordRef.current?.value
    ) {
      toast.error(t('register.errors.passwordsDontMatch'));
      return;
    } else if (passwordRef.current?.value.length < 8) {
      toast.error(t('register.errors.passwordIsTooShort'));
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
          toast.error("Data already taken!");
          return;
        } else {
          toast.success(t('register.success'))
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error(t('register.errors.somethingWentWrong'));
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
          {t('register.backToHome')}
        </Link>
        <h1 className="text-7xl mb-16 roboto">Register</h1>
        <Input placeholder={t('register.username')} ref={usernameRef} />
        <Input placeholder={t('register.email')} type="email" ref={emailRef} />
        <Input placeholder={t('register.password')} type="password" ref={passwordRef} />
        <Input
          placeholder={t('register.repeatPassword')}
          type="password"
          ref={repeatPasswordRef}
        />
        <Button type="default" onClick={register}>
          {t('register.title')}
        </Button>
        <Link to="/login">{t('register.loginLink')}</Link>
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
