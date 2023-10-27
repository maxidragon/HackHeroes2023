import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../Components/Loader";
import { TbArrowNarrowLeft, TbArrowNarrowRight } from "react-icons/tb";

interface Attendance {
  id: number;
  lessonId: number;
  position: number;
  subject: {
    id: number;
    name: string;
    code: string;
  };
  teacher: {
    id: number;
    name: string;
  };
  date: string;
  presenceType: {
    symbol: string;
    presence: boolean;
    absence: boolean;
    exemption: boolean;
    late: boolean;
    justified: boolean;
    deleted: boolean;
  };
  time: string;
}

export default function Attendance() {
  const [attendence, setAttendence] = useState<Array<Attendance>>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    setIsFetching(true);
    fetch(`${import.meta.env.VITE_API_URL}/vulcan/attendance?day=${date}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400)
          toast.error("An error occured while fetching attendance!");
        else {
          let filteredData: Array<Attendance> = [];

          data.forEach((item: Attendance) => {
            if (!filteredData.find((el) => el.position === item.position))
              filteredData.push(item);
          });

          setAttendence(filteredData);
          setIsFetching(false);
        }
      });
  }, [setAttendence, setIsFetching, date]);

  return (
    <div className="w-4/5 flex flex-col gap-8 items-center mb-8">
      <div className="rounded-full overflow-hidden text-xl text-white w-3/5 bg-purple-500 flex justify-between items-center">
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
      <div className="w-full relative overflow-x-auto sm:rounded-lg">
        {!isFetching &&
          (attendence?.length ? (
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-white uppercase">
                <tr>
                  <th scope="col" className="w-1/6 px-6 py-3 bg-purple-500">
                    Godzina
                  </th>
                  <th scope="col" className="px-6 py-3 bg-purple-700 w-1/3">
                    Przedmiot
                  </th>
                  <th scope="col" className="px-6 py-3 bg-purple-500 w-1/4">
                    Nauczyciel
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/6 bg-purple-700">
                    Status obecności
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendence.map((item: Attendance) => {
                  return (
                    <tr
                      className="border-b border-gray-200 dark:border-gray-700"
                      key={item.id}
                    >
                      <td className="px-6 py-4 whitespace-nowrap bg-purple-500 text-white">
                        {item.position + " " + item.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap bg-purple-700">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {item.subject.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="bg-purple-500">
                        <div className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {item.teacher.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white bg-purple-700">
                        {item.presenceType?.symbol}
                        {item.presenceType?.presence
                          ? "Obecny"
                          : item.presenceType?.absence && "Nieobecny"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-2xl text-center text-white">
              No attendance to display!
            </p>
          ))}
      </div>
    </div>
  );
}
