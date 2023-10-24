import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
        }
      });
  }, []);

  return (
    <div className="w-4/5">
      <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Przedmiot
              </th>
              <th scope="col" className="px-6 py-3">
                Oceny
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Przewidywana końcowa
              </th>
              <th scope="col" className="px-6 py-3">
                Końcowa
              </th>
            </tr>
          </thead>
          <tbody>
            {grades &&
              Object.keys(grades).map((key) => {
                return (
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                    >
                      {key}
                    </th>
                    <td className="px-6 py-4">
                      {grades[key].map((grade) => {
                        return (
                          <div className="flex items-center gap-2">
                            <span title={grade.grade + " " + grade.teacher + " " + grade.dateCreated} className="text-gray-500 dark:text-gray-400">
                              {grade.grade}
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                      Brak
                    </td>
                    <td className="px-6 py-4">Brak</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
