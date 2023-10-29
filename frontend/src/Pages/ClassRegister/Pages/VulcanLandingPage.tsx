import { useEffect, useState } from "react";
import { Grade } from "../../../lib/interfaces";
import toast from "react-hot-toast";
import { t } from "i18next";
import SchoolRegisterLogo from "../Assets/SchoolRegisterLogo.png";
import Loader from "../../../Components/Loader";

export default function VulcanLandingPage() {
  const [lastGrades, setLastGrades] = useState<Array<Grade>>([]);
  const [luckyNumber, setLuckyNumber] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    setIsFetching(true);
    fetch(`${import.meta.env.VITE_API_URL}/vulcan`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400) {
          toast.error(t("indexPageError"));
        } else {
          console.log(data);
          setLastGrades(data.lastGrades);
          setLuckyNumber(data.luckyNumber.number);
          setIsFetching(false);
        }
      });
  }, []);

  return (
    <div className="flex w-4/5 text-xl flex-col gap-8 my-8 items-center justify-center text-white">
      <h1 className="text-4xl roboto text-center">{t("indexPageTitle")}</h1>
      <p className="text-2xl roboto text-center">{t("indexPageSubtitle")}</p>
      {luckyNumber > 0 && (
        <div className="flex gap-4 items-center justify-center bg-bgLght rounded-xl p-4">
          <h2 className="text-2xl roboto">
            {t("indexPageLuckyNumber")}
          </h2>
          <p className="text-2xl roboto">{luckyNumber}</p>
        </div>
      )}
      <h2 className="text-2xl roboto">{t("indexPageLastGrades")}</h2>
      <div className="flex gap-16 2xl:w-2/3 w-full items-center justify-center">
        <div className="flex flex-col gap-2 items-center justify-center">
          {isFetching && <Loader width="200" />}
          {lastGrades.length > 0 &&
            lastGrades.map((grade) => (
              <div
                key={grade.id}
                className="flex w-full bg-bgLght rounded-xl p-4 gap-8 items-center justify-between"
              >
                <div className="flex flex-col gap-2 text-gray-400">
                  <p className="text-xl roboto">{grade.subject + ":" || ""}</p>
                  <p
                    className="text-xl roboto"
                    title={
                      (grade.weight && "waga: " + grade.weight) +
                      ", " +
                      grade.teacher +
                      ", " +
                      grade.subject
                    }
                  >
                    {grade.grade}
                  </p>
                </div>
                <p className="text-xl roboto text-gray-400">
                  {grade.dateCreated}
                </p>
              </div>
            ))}
        </div>
        <img
          src={SchoolRegisterLogo}
          alt="vulcanLogo"
          className="lg:block hidden w-[400px] h-[400px]"
        />
      </div>
    </div>
  );
}
