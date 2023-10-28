import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";
import { t } from "i18next";
import { Lesson } from "../../../lib/interfaces";

export default function Timetable() {
  const [lessons, setLessons] = useState<Array<Lesson>>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    setIsFetching(true);
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/lessons?day=${date}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.statusCode >= 400)
          toast.error(t('errorLessons'));
        else {

          setLessons(data);
          setIsFetching(false);
        }
      });
  }, [setLessons, setIsFetching, date]);


  return (
    <div className="w-full flex flex-col gap-8 items-center mb-8 px-4 md:w-4/5">
      <div className="rounded-full overflow-hidden text-xl text-white md:w-4/5 lg:w-3/5 w-full bg-purple-500 flex justify-between items-center">
        <TbArrowNarrowLeft
          className="cursor-pointer w-1/12 h-8 hover:bg-purple-700"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() - 1);
            setDate(newDate.toISOString().slice(0, 10));
          }}
        />
        <input
          type="date"
          className="text-center appearance-none bg-transparent border-none focus:outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TbArrowNarrowRight
          className="cursor-pointer w-1/12 h-8 hover:bg-purple-700"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + 1);
            setDate(newDate.toISOString().slice(0, 10));
          }}
        />
      </div>
      {isFetching && <Loader width="200" />}
      <div className="w-full relative overflow-x-auto rounded-lg">
        {!isFetching &&
          (lessons?.length ? (
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-white uppercase">
                <tr>
                  <th scope="col" className="w-1/6 lg:px-6 px-2 py-3 bg-purple-500">
                    {t('lesson')}
                  </th>
                  <th scope="col" className="lg:px-6 px-2 py-3 bg-purple-700 w-3/5">
                    {t('subject')}
                  </th>
                  <th scope="col" className="lg:table-cell hidden lg:px-6 px-2 py-3 bg-purple-500">
                    {t('teacher')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessons && lessons.map((item: Lesson) => {
                  const isMultipleGroups = lessons.some((lesson) => lesson.id !== item.id && lesson.position === item.position);
                  const multipleGroups = lessons.filter((lesson) => lesson.position === item.position);
                  if (isMultipleGroups && multipleGroups[0].id !== item.id) return null;
                  return (
                    <tr
                      className="border-b border-gray-700"
                      key={item.id}
                    >
                      <td className="lg:px-6 px-2 py-4 whitespace-nowrap bg-purple-500 text-white">
                        {item.position + " " + item.time}
                      </td>
                      <td className="lg:px-6 px-2 py-4 whitespace-nowrap bg-purple-700">
                        <div className="flex items-center">
                          <div className="lg:ml-4 w-full max-[500px]:w-28">
                            {isMultipleGroups ? (
                              <>
                                {multipleGroups.map((group: Lesson) => (
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-white">
                                      {group.subject}
                                    </div>
                                    <span className="text-white text-xs bg-purple-500 rounded-full px-2">
                                      {group.group.shortcut}
                                    </span>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="text-sm text-white">
                                {item.subject}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="bg-purple-500 lg:table-cell hidden">
                        <div className="lg:px-6 px-2 py-4 whitespace-nowrap">
                          {isMultipleGroups ? (
                            <>
                              {multipleGroups.map((group: Lesson) => (
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-white">
                                    {group.teacher}
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-sm text-white">
                              {item.teacher}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );

                })}
              </tbody>
            </table>
          ) : (
            <p className="text-2xl text-center text-white">
              {t('noLessons')}
            </p>
          ))}
      </div>
    </div>
  );
}
