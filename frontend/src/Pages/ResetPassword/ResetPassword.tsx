import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import background from "../../graphics/loginBackground.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbArrowLeft } from "react-icons/tb";
import { t } from "i18next";
import { ThreeDots } from "react-loader-spinner";

export default function ResetPassword() {
  const { hash } = useParams();
  const isPresent = useIsPresent();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const register = () => {

    if (
      !passwordRef.current?.value ||
      !repeatPasswordRef.current?.value
    ) {
      toast.error(t('registerErrorsAllFieldsRequired'));
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
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/auth/reset/${hash}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        newPassword: passwordRef.current?.value,
      }),
    })
      .then((res) => {
        if (res.status >= 400) {
          setIsLoading(false);
          toast.error(t('somethingWentWrong'));
          return;
        } else {
          toast.success(t('resetPasswordSuccess'))
          setTimeout(() => {
            setIsLoading(false);
            navigate("/login");
          }, 1000);
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
      <div className="xl:w-1/3 lg:w-1/2 w-screen flex flex-col items-center justify-center gap-6 relative">
        <Link
          className="absolute top-4 left-4 text-gray-400 flex items-center gap-2 hover:text-white transition-all"
          to="/"
        >
          <TbArrowLeft />
          {t("registerBackToHome")}
        </Link>
        <h1 className="text-7xl mb-16 roboto">{t('resetPasswordTitle')}</h1>
        <Input
          placeholder={t("registerPassword")}
          type="password"
          disabled={isLoading}
          ref={passwordRef}
          containerClassName="sm:w-96 w-72"
        />
        <Input
          placeholder={t("registerRepeatPassword")}
          type="password"
          disabled={isLoading}
          ref={repeatPasswordRef}
          containerClassName="sm:w-96 w-72"
        />
        <ThreeDots
          height={40}
          width={40}
          visible={isLoading}
        />
        <Button type="default" onClick={register} disabled={isLoading}>
          {t("changePassword")}
        </Button>
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
