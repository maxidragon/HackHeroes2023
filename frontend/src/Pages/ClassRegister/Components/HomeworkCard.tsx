import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { TbClick } from "react-icons/tb";
import { Homework } from "../../../lib/interfaces";

export default function HomeworkCard({ homework }: { homework: Homework }) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div className="2xl:w-1/5 xl:w-1/4 md:w-1/3 w-full h-72 cursor-pointer" onClick={handleClick}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        containerClassName="w-full h-full roboto shadow-lg"
      >
        <div className="w-full h-full px-8 grad rounded-lg flex flex-col justify-around items-center">
          <TbClick className="text-2xl absolute top-2 left-2" />
          <p className="text-xl text-center">{homework.subject}</p>
          <p className="text-sm">{homework.deadline}</p>
        </div>
        <div className="w-full h-full px-8 grad rounded-lg flex flex-col justify-around items-center">
          <TbClick className="text-2xl absolute top-2 left-2" />
          <p className="text-lg text-center">{homework.teacher}</p>
          <p className="text-lg text-center">{homework.content || "Brak opisu"}</p>
        </div>
      </ReactCardFlip>
    </div>
  );
}
