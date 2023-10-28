import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import HomeworkCard from "../Components/HomeworkCard";
import { t } from "i18next";
import { Homework as HomeworkInterface } from "../../../lib/interfaces";

export default function Homework() {
  const [homework, setHomework] = useState<Array<HomeworkInterface>>();
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/homework`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400)
          toast.error(t('noHomework'));
        else {
          setHomework(data);
          setIsFetching(false);
        }
      });
  }, []);

  return isFetching ? (
    <Loader width="200" />
  ) : (
    <div className="lg:w-4/5 md:w-full px-8 flex gap-8 flex-wrap justify-center text-white mb-10">
      {homework ? (
        homework.map((item: HomeworkInterface) => (
          <HomeworkCard homework={item} key={item.id}/>
        ))
      ) : (
        <p>{t('noHomework')}</p>
      )}
    </div>
  );
}
