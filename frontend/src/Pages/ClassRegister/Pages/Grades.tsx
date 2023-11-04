import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import { t } from "i18next";
import { Grades as GradesInterface } from "../../../lib/interfaces";
import { calculateWeightedAverage } from "../../../lib/utils";


export default function Grades() {
  const [grades, setGrades] = useState<GradesInterface>();
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/grades`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400)
          toast.error(t('gradesError'));
        else {
          setGrades(data);
          setIsFetching(false);
        }
      });
  }, []);

  return (
    <div className="w-4/5 flex flex-col gap-8 items-center mb-8">
      {isFetching && <Loader width="200" />}
      {!isFetching && grades && (
        <div className="w-full relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th
                  scope="col"
                  className="lg:px-6 px-2 py-3 bg-purple-500 w-1/3 md:w-1/4"
                >
                  {t('subject')}
                </th>
                <th scope="col" className="lg:px-6 px-2 py-3 bg-purple-700">
                  {t('grades')}
                </th>
                <th scope="col" className="md:table-cell hidden md:px-6 px-2 py-3 bg-purple-500">
                  {t('average')}
                </th>
                <th
                  scope="col"
                  className="md:table-cell hidden md:px-6 px-2 py-3 bg-purple-700 w-1/6"
                >
                  {t('predictedFinalGrade')}
                </th>
                <th
                  scope="col"
                  className="md:table-cell hidden md:px-6 px-2 py-3 bg-purple-500 w-1/6"
                >
                  {t('finalGrade')}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(grades).map((key) => {
                return (
                  <tr key={key} className="border-b border-gray-700">
                    <th
                      scope="row"
                      className="lg:px-6 px-2  py-4 font-medium whitespace-nowraptext-white text-white bg-purple-500"
                    >
                      {key}
                    </th>
                    <td className="lg:px-6 px-2 py-4 bg-purple-700 gap-2">
                      {grades[key].map((grade, i) => {
                        return (
                          <span
                            key={grade.id}
                            title={
                              grade.name +
                              " | " +
                              grade.teacher +
                              " | " +
                              grade.dateCreated
                            }
                            className="text-white h-full"
                          >
                            {grade.grade}
                            {i !== grades[key].length - 1 && ", "}
                          </span>
                        );
                      })}
                    </td>
                    <td className="md:table-cell hidden md:px-6 px-2 py-4 text-white bg-purple-500">
                      {calculateWeightedAverage(grades[key]) || t('none')}
                    </td>
                    <td className="md:table-cell hidden md:px-6 px-2 py-4 text-white bg-purple-700">
                      {t('none')}
                    </td>
                    <td className="md:table-cell hidden md:px-6 px-2 py-4 text-white bg-purple-500">
                      {t('none')}
                    </td>
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
