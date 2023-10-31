import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import ExamCard from "../Components/ExamCard";
import { t } from "i18next";
import { Exam } from "../../../lib/interfaces";


export default function Exams() {
  const [exams, setExams] = useState<Array<Exam>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/exams`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400)
          toast.error(t('errorExams'));
        else {
          setExams(data);
          setIsFetching(false);
        }
      });
  }, []);

  return isFetching ? (
    <Loader width="200" />
  ) : (
    <div className="lg:w-4/5 md:w-full px-8 flex gap-8 flex-wrap justify-center text-white mb-10">
      {exams.length > 0 ? (
        exams.map((item: Exam) => <ExamCard exam={item} key={item.id}/>)
      ) : (
        <p>{t('noExams')}</p>
      )}
    </div>
  );
}
