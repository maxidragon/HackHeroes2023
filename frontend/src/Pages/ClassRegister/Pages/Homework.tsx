import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import HomeworkCard from "../Components/HomeworkCard";

interface Homework {
  id: number;
  content: string;
  createdAt: string;
  teacher: string;
  deadline: string;
  subject: string;
}

export default function Homework() {
  const [homework, setHomework] = useState<Array<Homework>>();
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/homework`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400)
          toast.error("An error occured while fetching homework!");
        else {
          setHomework(data);
          setIsFetching(false);
        }
      });
  }, []);

  return isFetching ? (
    <Loader width="300" />
  ) : (
    <div className="w-4/5 flex gap-8 justify-center text-white">
      {homework ? (
        homework.map((item: Homework) => (
          <HomeworkCard homework={item} />
        ))
      ) : (
        <p>No homework :D!</p>
      )}
    </div>
  );
}
