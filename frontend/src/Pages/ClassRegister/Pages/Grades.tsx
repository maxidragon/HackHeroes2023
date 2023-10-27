import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";

interface Grade {
  id: number;
  grade: string;
  teacher: string;
  dateCreated: string;
  weight: number;
  name: string;
  type: string;
}

interface Grades {
  [key: string]: Grade[];
}

export default function Grades() {
  const [grades, setGrades] = useState<Grades>();
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/grades`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400)
          toast.error("An error occured while fetching grades!");
        else {
          setGrades(data);
          setIsFetching(false);
          setIsFetching(false);
        }
      });
  }, []);

  return (
    <div className="w-4/5 flex flex-col gap-8 items-center">
      {isFetching && <Loader width="300" />}
      {!isFetching && grades && (
        <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 bg-purple-500 w-1/4">
                  Przedmiot
                </th>
                <th scope="col" className="px-6 py-3 bg-purple-700">
                  Oceny
                </th>
                <th scope="col" className="px-6 py-3 bg-purple-500 w-1/6">
                  Przewidywana końcowa
                </th>
                <th scope="col" className="px-6 py-3 w-1/6 bg-purple-700">
                  Końcowa
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(grades).map((key) => {
                return (
                  <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowraptext-white text-white bg-purple-500"
                    >
                      {key}
                    </th>
                    <td className="px-6 py-4 bg-purple-700 flex items-center gap-2">
                      {grades[key].map((grade) => {
                        return (
                          <span
                            key={grade.id}
                            title={
                              grade.grade +
                              " " +
                              grade.teacher +
                              " " +
                              grade.dateCreated
                            }
                            className="text-white"
                          >
                            {grade.grade}
                          </span>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4 text-white bg-purple-500">Brak</td>
                    <td className="px-6 py-4 text-white bg-purple-700">Brak</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
